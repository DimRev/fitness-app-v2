import axios from "axios";
import { useEffect } from "react";
import { useInfiniteQuery } from "react-query";
import useSocket from "~/features/socket/hooks/useSocket";
import axiosInstance from "~/lib/axios";
import { QUERY_KEYS } from "~/lib/reactQuery";

type GetFoodItemsRequestBody = {
  limit: number;
  offset: number;
  text_filter?: string | null;
};

type ErrorResponseBody = {
  message: string;
};

export function useGetFoodItemsInfiniteQuery(params: GetFoodItemsRequestBody) {
  const { joinSocketGroup, leaveSocketGroup } = useSocket();
  useEffect(() => {
    void joinSocketGroup(QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS_INF_QUERY);
    return () => {
      void leaveSocketGroup(QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS_INF_QUERY);
    };
  }, [joinSocketGroup, leaveSocketGroup]);
  return useInfiniteQuery<FoodItemWithPages, Error>(
    [
      QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS_INF_QUERY,
      { limit: params.limit, text_filter: params.text_filter },
    ],
    async ({ pageParam = 0 }: { pageParam?: number }) => {
      return await getFoodItems({
        limit: params.limit,
        offset: pageParam,
        text_filter: params.text_filter ?? null,
      });
    },
    {
      getNextPageParam: (lastPage, pages) => {
        const totalLoadedItems = pages.flatMap(
          (page) => page.food_items,
        ).length;
        if (totalLoadedItems >= lastPage.total_items) {
          return undefined; // No more pages
        }
        return totalLoadedItems; // Return the next offset
      },
    },
  );
}

async function getFoodItems({
  limit,
  offset,
  text_filter,
}: GetFoodItemsRequestBody): Promise<FoodItemWithPages> {
  try {
    const response = await axiosInstance.get<FoodItemWithPages>("/food_items", {
      params: { limit, offset, text_filter },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errResponse = error.response.data as ErrorResponseBody;
      console.error(`${error.response.status} | ${errResponse.message}`);
      throw new Error(errResponse.message);
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
}

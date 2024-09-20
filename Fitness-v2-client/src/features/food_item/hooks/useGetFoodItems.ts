import axios from "axios";
import { useEffect } from "react";
import { useQuery } from "react-query";
import useSocket from "~/features/socket/hooks/useSocket";
import axiosInstance from "~/lib/axios";
import { QUERY_KEYS, USE_QUERY_DEFAULT_OPTIONS } from "~/lib/reactQuery";

type GetFoodItemsRequestBody = {
  limit: number;
  offset: number;
  text_filter?: string | null;
};

type ErrorResponseBody = {
  message: string;
};

function useGetFoodItems(params: GetFoodItemsRequestBody) {
  const { joinSocketGroup, leaveSocketGroup } = useSocket();
  useEffect(() => {
    void joinSocketGroup(QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS);
    return () => {
      void leaveSocketGroup(QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS);
    };
  }, [joinSocketGroup, leaveSocketGroup]);
  return useQuery<FoodItemWithPages, Error>({
    ...USE_QUERY_DEFAULT_OPTIONS,
    queryKey: [
      QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS,
      {
        limit: params.limit,
        offset: params.offset,
        text_filter: params.text_filter,
      },
    ],

    queryFn: () => getFoodItemsPending(params),
    enabled: !!params,
  });
}

async function getFoodItemsPending({
  limit,
  offset,
  text_filter,
}: GetFoodItemsRequestBody): Promise<FoodItemWithPages> {
  try {
    const response = await axiosInstance.get<FoodItemWithPages>(`/food_items`, {
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

export default useGetFoodItems;

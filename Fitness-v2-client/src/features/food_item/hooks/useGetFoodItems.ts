import axios from "axios";
import { useLayoutEffect } from "react";
import { useInfiniteQuery, useQueryClient } from "react-query";
import useSocket from "~/features/socket/hooks/useSocket";
import axiosInstance from "~/lib/axios";
import { QUERY_KEYS } from "~/lib/reactQuery";
import {
  type BroadcastData,
  type Message,
  parseSocketData,
} from "~/lib/socket";

type GetFoodItemsRequestBody = {
  limit: number;
  offset: number;
  text_filter?: string | null;
};

type ErrorResponseBody = {
  message: string;
};

export function useGetFoodItems(params: GetFoodItemsRequestBody) {
  const { joinSocketGroup, leaveSocketGroup, socket } = useSocket();
  const queryClient = useQueryClient();
  useLayoutEffect(() => {
    void joinSocketGroup(QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS);

    if (socket) {
      try {
        socket.onmessage = (event: MessageEvent<string>) => {
          const message = JSON.parse(event.data) as Message;
          switch (message.action) {
            case "broadcast-group":
            case "broadcast-global":
            case "broadcast-all":
              if (message.data) {
                const broadcastData = parseSocketData<BroadcastData>(
                  message.data,
                );
                console.log("Received data:", broadcastData);
                if (
                  broadcastData.group === QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS
                ) {
                  void queryClient.invalidateQueries([
                    QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS,
                    broadcastData.data,
                  ]);
                }
              }
              break;
          }
        };
      } catch (err) {
        console.log("Failed to parse WebSocket message", err);
      }
    }

    return () => {
      void leaveSocketGroup(QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return useInfiniteQuery<FoodItemWithPages, Error>(
    [
      QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS,
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
        if (totalLoadedItems >= lastPage.total_pages) {
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

import axios from "axios";
import { useLayoutEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import useSocket from "~/features/socket/useSocket";
import axiosInstance from "~/lib/axios";
import { QUERY_KEYS, USE_QUERY_DEFAULT_OPTIONS } from "~/lib/reactQuery";
import {
  type BroadcastData,
  parseSocketData,
  type Message,
} from "~/lib/socket";

type GetMealsByUserIDRequestBody = {
  limit: number;
  offset: number;
  text_filter?: string | null;
};

type ErrorResponseBody = {
  message: string;
};

function useGetFoodItemsPending(params: GetMealsByUserIDRequestBody) {
  const { joinSocketGroup, leaveSocketGroup, socket } = useSocket();
  const queryClient = useQueryClient();
  useLayoutEffect(() => {
    joinSocketGroup(QUERY_KEYS.FOOD_ITEMS_PENDING.GET_FOOD_ITEMS_PENDING);

    if (socket) {
      try {
        socket.onmessage = (event: MessageEvent<string>) => {
          const message = JSON.parse(event.data) as Message;
          switch (message.action) {
            case "broadcast-group":
              if (message.data) {
                const data = parseSocketData<BroadcastData>(message.data);
                if (
                  data.group ===
                  QUERY_KEYS.FOOD_ITEMS_PENDING.GET_FOOD_ITEMS_PENDING
                ) {
                  void queryClient.invalidateQueries([
                    QUERY_KEYS.FOOD_ITEMS_PENDING.GET_FOOD_ITEMS_PENDING,
                    data.data,
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
      leaveSocketGroup(QUERY_KEYS.FOOD_ITEMS_PENDING.GET_FOOD_ITEMS_PENDING);
    };
  });

  return useQuery<FoodItemsPendingWithPages, Error>({
    ...USE_QUERY_DEFAULT_OPTIONS,
    queryKey: [
      QUERY_KEYS.FOOD_ITEMS_PENDING.GET_FOOD_ITEMS_PENDING,
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
}: GetMealsByUserIDRequestBody): Promise<FoodItemsPendingWithPages> {
  try {
    const response = await axiosInstance.get<FoodItemsPendingWithPages>(
      `/food_items_pending`,
      {
        params: { limit, offset, text_filter },
      },
    );
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

export default useGetFoodItemsPending;

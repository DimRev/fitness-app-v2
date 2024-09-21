import axios from "axios";
import { useEffect } from "react";
import { useQuery } from "react-query";
import useSocket from "~/features/socket/hooks/useSocket";
import axiosInstance from "~/lib/axios";
import { QUERY_KEYS, USE_QUERY_DEFAULT_OPTIONS } from "~/lib/reactQuery";

type GetFoodItemsByIDRequestBody = {
  food_item_id: string;
};

type ErrorResponseBody = {
  message: string;
};

function useGetFoodItemsByID(params: GetFoodItemsByIDRequestBody) {
  const { joinSocketGroup, leaveSocketGroup } = useSocket();
  useEffect(() => {
    void joinSocketGroup(QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS_BY_USER_ID);
    return () => {
      void leaveSocketGroup(QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS_BY_USER_ID);
    };
  }, [joinSocketGroup, leaveSocketGroup]);
  return useQuery<FoodItem, Error>({
    ...USE_QUERY_DEFAULT_OPTIONS,
    queryKey: [
      QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS_BY_USER_ID,
      {
        food_item_id: params.food_item_id,
      },
    ],

    queryFn: () => getFoodItemsPending(params),
    enabled: !!params,
  });
}

async function getFoodItemsPending({
  food_item_id,
}: GetFoodItemsByIDRequestBody): Promise<FoodItem> {
  try {
    const response = await axiosInstance.get<FoodItem>(
      `/food_items/${food_item_id}`,
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

export default useGetFoodItemsByID;

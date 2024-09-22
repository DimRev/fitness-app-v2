import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import useSocket from "~/features/socket/hooks/useSocket";
import axiosInstance from "~/lib/axios";
import { QUERY_KEYS, USE_MUTATION_DEFAULT_OPTIONS } from "~/lib/reactQuery";
import { type FoodItemFormSchema } from "../foodItem.schema";

type DeleteFoodItemRequestParams = {
  food_item_id: string;
} & FoodItemFormSchema;

type ErrorResponseBody = {
  message: string;
};

function useUpdateFoodItem() {
  const queryClient = useQueryClient();
  const { sendSocketGroupMessage } = useSocket();

  return useMutation<FoodItem, Error, DeleteFoodItemRequestParams>(
    deleteFoodItem,
    {
      ...USE_MUTATION_DEFAULT_OPTIONS,
      onSuccess: (_data, { food_item_id }) => {
        const invalidateData: BroadcastData = {
          group: [
            QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS,
            QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS_INF_QUERY,
          ],
          action: "invalidate",
          data: {},
        };

        const invalidateDataByMealId: BroadcastData = {
          group: [QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS_BY_USER_ID],
          action: "invalidate",
          data: {
            food_item_id: food_item_id,
          },
        };

        void sendSocketGroupMessage(
          QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS,
          invalidateData,
        );

        void sendSocketGroupMessage(
          QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS_BY_USER_ID,
          invalidateDataByMealId,
        );

        void queryClient.invalidateQueries([
          QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS,
        ]);

        void queryClient.invalidateQueries([
          QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS_INF_QUERY,
        ]);

        void queryClient.invalidateQueries([
          QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS_BY_USER_ID,
          { food_item_id: food_item_id },
        ]);
      },
    },
  );
}

async function deleteFoodItem({
  food_item_id,
  name,
  calories,
  fat,
  carbs,
  protein,
  food_type,
  description,
  image_url,
}: DeleteFoodItemRequestParams): Promise<FoodItem> {
  try {
    const response = await axiosInstance.put<FoodItem>(
      `/food_items/${food_item_id}`,
      {
        name: name,
        description: description,
        image_url: image_url,
        food_type: food_type,
        calories: calories,
        fat: fat,
        protein: protein,
        carbs: carbs,
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

export default useUpdateFoodItem;

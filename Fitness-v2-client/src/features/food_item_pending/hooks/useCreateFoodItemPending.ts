import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "~/lib/axios";
import { QUERY_KEYS, USE_MUTATION_DEFAULT_OPTIONS } from "~/lib/reactQuery";
import { type FoodItemPendingFormSchema } from "../foodItemsPending.schema";
import useSocket from "~/features/socket/hooks/useSocket";

type ErrorResponseBody = {
  message: string;
};

function useCreateFoodItemPending() {
  const queryClient = useQueryClient();
  const { sendSocketGroupMessage } = useSocket();
  return useMutation<FoodItemsPending, Error, FoodItemPendingFormSchema>(
    createFoodItemPending,
    {
      ...USE_MUTATION_DEFAULT_OPTIONS,
      onSuccess: () => {
        const stringifiedData = JSON.stringify({
          group: QUERY_KEYS.FOOD_ITEMS_PENDING.GET_FOOD_ITEMS_PENDING,
          data: {},
        });
        sendSocketGroupMessage(
          QUERY_KEYS.FOOD_ITEMS_PENDING.GET_FOOD_ITEMS_PENDING,
          `"${stringifiedData}"`,
        );
        void queryClient.invalidateQueries([
          QUERY_KEYS.FOOD_ITEMS_PENDING.GET_FOOD_ITEMS_PENDING,
        ]);
      },
    },
  );
}

async function createFoodItemPending({
  calories,
  fat,
  carbs,
  protein,
  food_type,
  description,
  image_url,
  name,
}: FoodItemPendingFormSchema): Promise<FoodItemsPending> {
  try {
    const response = await axiosInstance.post<FoodItemsPending>(
      `/food_items_pending`,
      {
        calories,
        fat,
        carbs,
        protein,
        food_type,
        description,
        image_url,
        name,
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

export default useCreateFoodItemPending;

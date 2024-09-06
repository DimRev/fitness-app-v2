import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "~/lib/axios";
import { QUERY_KEYS, USE_MUTATION_DEFAULT_OPTIONS } from "~/lib/reactQuery";

type CreateFoodItemPendingRequestBody = {
  name: string;
  description: string | null;
  image_url: string | null;
  food_type: string;
  calories: string;
  fat: string;
  protein: string;
  carbs: string;
};

type ErrorResponseBody = {
  message: string;
};

function useCreateFoodItemPending() {
  const queryClient = useQueryClient();
  return useMutation<FoodItemsPending, Error, CreateFoodItemPendingRequestBody>(
    createFoodItemPending,
    {
      ...USE_MUTATION_DEFAULT_OPTIONS,
      onSuccess: () => {
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
}: CreateFoodItemPendingRequestBody): Promise<FoodItemsPending> {
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

import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "~/lib/axios";
import { QUERY_KEYS } from "~/lib/reactQuery";

type CreateMealRequestBody = {
  name: string;
  description: string | null;
  image_url: string | null;
  food_items: {
    food_item_id: string;
    amount: number;
  }[];
};

type ErrorResponseBody = {
  message: string;
};

function useCreateMeal() {
  const queryClient = useQueryClient();
  return useMutation<MealWithFoodItems, Error, CreateMealRequestBody>(
    createMeal,
    {
      onSuccess: () => {
        void queryClient.invalidateQueries([
          QUERY_KEYS.MEALS.GET_MEALS_BY_USER_ID,
        ]);
      },
    },
  );
}

async function createMeal({
  description,
  image_url,
  name,
  food_items,
}: CreateMealRequestBody): Promise<MealWithFoodItems> {
  try {
    const response = await axiosInstance.post<MealWithFoodItems>(`/meals`, {
      name,
      description,
      image_url,
      food_items,
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

export default useCreateMeal;

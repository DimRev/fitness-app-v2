import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "~/lib/axios";
import { QUERY_KEYS } from "~/lib/reactQuery";

type UpdateMealRequestBody = {
  name: string;
  description: string | null;
  image_url: string | null;
  food_items: {
    food_item_id: string;
    amount: number;
  }[];
  meal_id: string;
};

type ErrorResponseBody = {
  message: string;
};

function useUpdateMeal() {
  const queryClient = useQueryClient();
  return useMutation<MealWithFoodItems, Error, UpdateMealRequestBody>(
    updateMeal,
    {
      onSuccess: (_data, { meal_id }) => {
        void queryClient.invalidateQueries([
          QUERY_KEYS.MEALS.GET_MEALS_BY_USER_ID,
        ]);
        void queryClient.invalidateQueries([
          QUERY_KEYS.MEALS.GET_MEAL_BY_ID,
          { mealId: meal_id },
        ]);
      },
    },
  );
}

async function updateMeal({
  description,
  image_url,
  name,
  food_items,
  meal_id,
}: UpdateMealRequestBody): Promise<MealWithFoodItems> {
  try {
    const response = await axiosInstance.put<MealWithFoodItems>(
      `/meals/${meal_id}`,
      {
        name,
        description,
        image_url,
        food_items,
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

export default useUpdateMeal;

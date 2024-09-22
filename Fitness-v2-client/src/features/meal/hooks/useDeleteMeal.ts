import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "~/lib/axios";
import { QUERY_KEYS } from "~/lib/reactQuery";

type DeleteMealRequestBody = {
  meal_id: string;
};

type ErrorResponseBody = {
  message: string;
};

function useDeleteMeal() {
  const queryClient = useQueryClient();
  return useMutation<MealWithFoodItems, Error, DeleteMealRequestBody>(
    deleteMeal,
    {
      onSuccess: (_data, { meal_id }) => {
        void queryClient.invalidateQueries([
          QUERY_KEYS.MEALS.GET_MEALS_BY_USER_ID,
        ]);
        void queryClient.invalidateQueries([
          QUERY_KEYS.MEALS.GET_MEAL_BY_ID,
          { meal_id: meal_id },
        ]);
      },
    },
  );
}

async function deleteMeal({
  meal_id,
}: DeleteMealRequestBody): Promise<MealWithFoodItems> {
  try {
    const response = await axiosInstance.delete<MealWithFoodItems>(
      `/meals/${meal_id}`,
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

export default useDeleteMeal;

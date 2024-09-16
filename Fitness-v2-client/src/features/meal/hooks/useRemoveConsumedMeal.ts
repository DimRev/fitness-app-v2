import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "~/lib/axios";
import { QUERY_KEYS } from "~/lib/reactQuery";

type RemoveConsumedMealRequestBody = {
  id: string;
  meal_id: string;
  date: string;
};

type RemoveConsumedMealResponseBody = {
  message: string;
};

type ErrorResponseBody = {
  message: string;
};

function useRemoveConsumedMeal() {
  const queryClient = useQueryClient();
  return useMutation<
    RemoveConsumedMealResponseBody,
    Error,
    RemoveConsumedMealRequestBody
  >(removeConsumedMeal, {
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries([
        QUERY_KEYS.MEALS_CONSUMED.GET_MEALS_CONSUMED_BY_MEAL_ID,
        { meal_id: variables.meal_id },
      ]);
      void queryClient.invalidateQueries([
        QUERY_KEYS.MEALS_CONSUMED.GET_MEALS_CONSUMED_BY_DATE,
        { date: variables.date },
      ]);
    },
  });
}

async function removeConsumedMeal({
  id,
}: RemoveConsumedMealRequestBody): Promise<RemoveConsumedMealResponseBody> {
  try {
    const response = await axiosInstance.delete<RemoveConsumedMealResponseBody>(
      `/meals/consume/${id}`,
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

export default useRemoveConsumedMeal;

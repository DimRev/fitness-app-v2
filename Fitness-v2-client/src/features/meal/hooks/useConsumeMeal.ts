import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "~/lib/axios";
import { QUERY_KEYS } from "~/lib/reactQuery";

type ConsumeMealRequestBody = {
  meal_id: string;
  date: string;
};

type ErrorResponseBody = {
  message: string;
};

function useConsumeMeal() {
  const queryClient = useQueryClient();
  return useMutation<ConsumedMeal, Error, ConsumeMealRequestBody>(consumeMeal, {
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries([
        QUERY_KEYS.MEALS_CONSUMED.GET_MEALS_CONSUMED_BY_MEAL_ID,
        { meal_id: variables.meal_id },
      ]);
      void queryClient.invalidateQueries([
        QUERY_KEYS.MEALS_CONSUMED.GET_MEALS_CONSUMED_BY_DATE,
        { date: variables.date },
      ]);
      void queryClient.invalidateQueries([
        QUERY_KEYS.MEALS.GET_MEAL_BY_ID,
        { meal_id: variables.meal_id },
      ]);
    },
  });
}

async function consumeMeal({
  meal_id,
  date,
}: ConsumeMealRequestBody): Promise<ConsumedMeal> {
  try {
    const response = await axiosInstance.post<ConsumedMeal>(`/meals/consume`, {
      date,
      meal_id,
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

export default useConsumeMeal;

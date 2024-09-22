import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "~/lib/axios";
import { QUERY_KEYS } from "~/lib/reactQuery";

type ToggleConsumeMealRequestBody = {
  meal_id: string;
  date: Date;
};

type ErrorResponseBody = {
  message: string;
};

type ToggleConsumeMealResponseBody = {
  message: string;
  was_deleted: boolean;
};

function useToggleToggleConsumeMeal() {
  const queryClient = useQueryClient();
  return useMutation<
    ToggleConsumeMealResponseBody,
    Error,
    ToggleConsumeMealRequestBody
  >(toggleConsumeMeal, {
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

async function toggleConsumeMeal({
  meal_id,
  date,
}: ToggleConsumeMealRequestBody): Promise<ToggleConsumeMealResponseBody> {
  try {
    const response = await axiosInstance.post<ToggleConsumeMealResponseBody>(
      `/meals/consume/toggle`,
      {
        meal_id,
        date,
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

export default useToggleToggleConsumeMeal;

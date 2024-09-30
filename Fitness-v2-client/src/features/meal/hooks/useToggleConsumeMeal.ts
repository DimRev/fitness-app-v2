import useMutateQuery from "~/features/shared/hooks/useMutateQuery";
import { QUERY_KEYS } from "~/lib/reactQuery";

type ToggleConsumeMealRequestBody = {
  meal_id: string;
  date: Date;
};

interface ErrorResponseBody extends Error {
  message: string;
}

type ToggleConsumeMealResponseBody = {
  message: string;
  was_deleted: boolean;
};

function useToggleToggleConsumeMeal() {
  return useMutateQuery<
    ToggleConsumeMealRequestBody,
    ToggleConsumeMealResponseBody,
    ErrorResponseBody
  >(
    (_d, v) => [
      {
        queryKey: QUERY_KEYS.MEALS_CONSUMED.GET_MEALS_CONSUMED_BY_MEAL_ID,
        params: { meal_id: v.meal_id },
        isBroadcast: false,
      },
      {
        queryKey: QUERY_KEYS.MEALS_CONSUMED.GET_MEALS_CONSUMED_BY_DATE,
        params: { date: v.date },
        isBroadcast: false,
      },
      {
        queryKey: QUERY_KEYS.MEALS.GET_MEAL_BY_ID,
        params: { meal_id: v.meal_id },
        isBroadcast: false,
      },
      {
        queryKey: QUERY_KEYS.CHART_DATA.GET_CHART_DATA_MEALS_CONSUMED,
        isBroadcast: false,
      },
      {
        queryKey: QUERY_KEYS.CALENDAR_DATA.GET_CALENDAR_DATA_BY_DATE,
        params: { date: v.date },
        isBroadcast: false,
      },
    ],
    () => "/meals/consume/toggle",
    "post",
  );
}

export default useToggleToggleConsumeMeal;

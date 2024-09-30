import useMutateQuery from "~/features/shared/hooks/useMutateQuery";
import { QUERY_KEYS } from "~/lib/reactQuery";

type DeleteMealRequestBody = {
  meal_id: string;
};

interface ErrorResponseBody extends Error {
  message: string;
}

function useDeleteMeal() {
  return useMutateQuery<
    DeleteMealRequestBody,
    MealWithFoodItems,
    ErrorResponseBody
  >(
    (_d, v) => [
      {
        queryKey: QUERY_KEYS.MEALS.GET_MEALS_BY_USER_ID,
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
        isBroadcast: false,
      },
    ],
    (d) => `/meals/${d.meal_id}`,
    "delete",
  );
}

export default useDeleteMeal;

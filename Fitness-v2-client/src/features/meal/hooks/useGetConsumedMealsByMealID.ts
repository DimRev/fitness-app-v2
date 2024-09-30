import { type UseQueryResult } from "react-query";
import useGetQuery from "~/features/shared/hooks/useGetQuery";
import { QUERY_KEYS } from "~/lib/reactQuery";

type GetConsumedMealsByMealIDRequestBody = {
  mealId: string;
};

interface ErrorResponseBody extends Error {
  message: string;
}

function useGetConsumedMealsByMealID(
  params: GetConsumedMealsByMealIDRequestBody,
): UseQueryResult<ConsumedMeal[], Error> {
  return useGetQuery<unknown, ConsumedMeal[], ErrorResponseBody>(
    { meal_id: params.mealId },
    QUERY_KEYS.MEALS_CONSUMED.GET_MEALS_CONSUMED_BY_MEAL_ID,
    `/meals/consume/${params.mealId}`,
    true,
  );
}

export default useGetConsumedMealsByMealID;

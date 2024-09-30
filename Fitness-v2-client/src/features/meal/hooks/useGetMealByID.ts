import { type UseQueryResult } from "react-query";
import useGetQuery from "~/features/shared/hooks/useGetQuery";
import { QUERY_KEYS } from "~/lib/reactQuery";

type GetMealByIDRequestBody = {
  mealId: string;
};

interface ErrorResponseBody extends Error {
  message: string;
}

function useGetMealByID(
  params: GetMealByIDRequestBody,
): UseQueryResult<MealWithNutritionAndFoodItems, Error> {
  return useGetQuery<unknown, MealWithNutritionAndFoodItems, ErrorResponseBody>(
    { meal_id: params.mealId },
    QUERY_KEYS.MEALS.GET_MEAL_BY_ID,
    `/meals/${params.mealId}`,
    true,
  );
}

export default useGetMealByID;

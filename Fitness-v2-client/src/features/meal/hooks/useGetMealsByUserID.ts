import { type UseQueryResult } from "react-query";
import useGetQuery from "~/features/shared/hooks/useGetQuery";
import { QUERY_KEYS } from "~/lib/reactQuery";

type GetMealsByUserIDRequestBody = {
  limit: number;
  offset: number;
  text_filter?: string | null;
};

interface ErrorResponseBody extends Error {
  message: string;
}

function useGetMealsByUserID(
  params: GetMealsByUserIDRequestBody,
): UseQueryResult<MealWithNutritionWithPages, Error> {
  return useGetQuery<
    GetMealsByUserIDRequestBody,
    MealWithNutritionWithPages,
    ErrorResponseBody
  >(params, QUERY_KEYS.MEALS.GET_MEALS_BY_USER_ID, "/meals");
}

export default useGetMealsByUserID;

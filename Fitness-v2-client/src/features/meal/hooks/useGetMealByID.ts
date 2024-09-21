import axios from "axios";
import { useQuery, type UseQueryResult } from "react-query";
import axiosInstance from "~/lib/axios";
import { QUERY_KEYS, USE_QUERY_DEFAULT_OPTIONS } from "~/lib/reactQuery";

type GetMealByIDRequestBody = {
  mealId: string;
};

type ErrorResponseBody = {
  message: string;
};

function useGetMealByID(
  params: GetMealByIDRequestBody,
): UseQueryResult<MealWithNutritionAndFoodItems, Error> {
  return useQuery<MealWithNutritionAndFoodItems, Error>({
    ...USE_QUERY_DEFAULT_OPTIONS,
    queryKey: [QUERY_KEYS.MEALS.GET_MEAL_BY_ID, { meal_id: params.mealId }],

    queryFn: () => getMealByID(params),
    enabled: !!params,
  });
}

async function getMealByID({
  mealId,
}: GetMealByIDRequestBody): Promise<MealWithNutritionAndFoodItems> {
  try {
    const response = await axiosInstance.get<MealWithNutritionAndFoodItems>(
      `/meals/${mealId}`,
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

export default useGetMealByID;

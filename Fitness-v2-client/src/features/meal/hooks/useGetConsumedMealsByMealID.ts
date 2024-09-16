import axios from "axios";
import { useQuery, type UseQueryResult } from "react-query";
import axiosInstance from "~/lib/axios";
import { QUERY_KEYS, USE_QUERY_DEFAULT_OPTIONS } from "~/lib/reactQuery";

type GetConsumedMealsByMealIDRequestBody = {
  mealId: string;
};

type ErrorResponseBody = {
  message: string;
};

function useGetConsumedMealsByMealID(
  params: GetConsumedMealsByMealIDRequestBody,
): UseQueryResult<ConsumedMeal[], Error> {
  return useQuery<ConsumedMeal[], Error>({
    ...USE_QUERY_DEFAULT_OPTIONS,
    queryKey: [
      QUERY_KEYS.MEALS_CONSUMED.GET_MEALS_CONSUMED_BY_MEAL_ID,
      { mealId: params.mealId },
    ],

    queryFn: () => getConsumedMealsByMealID(params),
    enabled: !!params,
  });
}

async function getConsumedMealsByMealID({
  mealId,
}: GetConsumedMealsByMealIDRequestBody): Promise<ConsumedMeal[]> {
  try {
    const response = await axiosInstance.get<ConsumedMeal[]>(
      `/meals/consume/${mealId}`,
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

export default useGetConsumedMealsByMealID;

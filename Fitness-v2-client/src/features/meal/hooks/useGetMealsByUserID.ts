import axios from "axios";
import { useQuery, type UseQueryResult } from "react-query";
import axiosInstance from "~/lib/axios";
import { QUERY_KEYS, USE_QUERY_DEFAULT_OPTIONS } from "~/lib/reactQuery";

type GetMealsByUserIDRequestBody = {
  limit: number;
  offset: number;
  text_filter?: string | null;
};

type ErrorResponseBody = {
  message: string;
};

function useGetMealsByUserID(
  params: GetMealsByUserIDRequestBody,
): UseQueryResult<MealWithNutritionWithPages, Error> {
  return useQuery<MealWithNutritionWithPages, Error>({
    ...USE_QUERY_DEFAULT_OPTIONS,
    queryKey: [
      QUERY_KEYS.MEALS.GET_MEALS_BY_USER_ID,
      {
        limit: params.limit,
        offset: params.offset,
        text_filter: params.text_filter,
      },
    ],

    queryFn: () => getMealsByUserID(params),
    enabled: !!params,
  });
}

async function getMealsByUserID({
  limit,
  offset,
  text_filter,
}: GetMealsByUserIDRequestBody): Promise<MealWithNutritionWithPages> {
  try {
    const response = await axiosInstance.get<MealWithNutritionWithPages>(
      `/meals`,
      {
        params: { limit, offset, text_filter },
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

export default useGetMealsByUserID;

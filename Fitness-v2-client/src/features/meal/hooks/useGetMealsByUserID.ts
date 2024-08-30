import axios from "axios";
import { useQuery, type UseQueryResult } from "react-query";
import axiosInstance from "~/lib/axios";

type GetMealsByUserIDRequestBody = {
  limit: number;
  offset: number;
};

type ErrorResponseBody = {
  message: string;
};

function useGetMealsByUserID(
  params: GetMealsByUserIDRequestBody,
): UseQueryResult<MealWithNutrition[], Error> {
  return useQuery<MealWithNutrition[], Error>(
    ["getMealsByUserID", params.limit, params.offset],
    () => getMealsByUserID(params),
    {
      enabled: !!params,
    },
  );
}

async function getMealsByUserID({
  limit,
  offset,
}: GetMealsByUserIDRequestBody): Promise<MealWithNutrition[]> {
  try {
    const response = await axiosInstance.get<MealWithNutrition[]>(`/meals`, {
      params: { limit, offset },
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

export default useGetMealsByUserID;

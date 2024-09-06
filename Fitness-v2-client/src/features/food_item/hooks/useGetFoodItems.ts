import axios from "axios";
import { useQuery } from "react-query";
import axiosInstance from "~/lib/axios";
import { QUERY_KEYS } from "~/lib/reactQuery";

type GetFoodItemsRequestBody = {
  limit: number;
  offset: number;
};

type ErrorResponseBody = {
  message: string;
};

export function useGetFoodItems(params: GetFoodItemsRequestBody) {
  return useQuery<FoodItemWithPages, Error>({
    queryKey: [
      QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS,
      { limit: params.limit, offset: params.offset },
    ],
    queryFn: () => getFoodItems(params),
    enabled: !!params,
  });
}

async function getFoodItems({
  limit,
  offset,
}: GetFoodItemsRequestBody): Promise<FoodItemWithPages> {
  try {
    const response = await axiosInstance.get<FoodItemWithPages>("/food_items", {
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

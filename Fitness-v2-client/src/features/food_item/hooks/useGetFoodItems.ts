import useGetQuery from "~/features/shared/hooks/useGetQuery";
import { QUERY_KEYS } from "~/lib/reactQuery";

type GetFoodItemsRequestBody = {
  limit: number;
  offset: number;
  text_filter?: string | null;
};

interface ErrorResponseBody extends Error {
  message: string;
}

function useGetFoodItems(params: GetFoodItemsRequestBody) {
  return useGetQuery<
    GetFoodItemsRequestBody,
    FoodItemWithPages,
    ErrorResponseBody
  >(params, QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS, "/food_items");
}

export default useGetFoodItems;

import useGetQuery from "~/features/shared/hooks/useGetQuery";
import { QUERY_KEYS } from "~/lib/reactQuery";

type GetFoodItemsByIDRequestBody = {
  food_item_id: string;
};

interface ErrorResponseBody extends Error {
  message: string;
}

function useGetFoodItemsByID(params: GetFoodItemsByIDRequestBody) {
  return useGetQuery<GetFoodItemsByIDRequestBody, FoodItem, ErrorResponseBody>(
    params,
    QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS_BY_ID,
    `/food_items/${params.food_item_id}`,
    true,
  );
}

export default useGetFoodItemsByID;

import useGetQuery from "~/features/shared/hooks/useGetQuery";
import { QUERY_KEYS } from "~/lib/reactQuery";

type GetFoodItemsPendingRequestBody = {
  limit: number;
  offset: number;
  text_filter?: string | null;
};

interface ErrorResponseBody extends Error {
  message: string;
}

function useGetFoodItemsPending(params: GetFoodItemsPendingRequestBody) {
  return useGetQuery<
    GetFoodItemsPendingRequestBody,
    FoodItemsPendingWithPages,
    ErrorResponseBody
  >(
    params,
    QUERY_KEYS.FOOD_ITEMS_PENDING.GET_FOOD_ITEMS_PENDING,
    "/food_items_pending",
    false,
  );
}

export default useGetFoodItemsPending;

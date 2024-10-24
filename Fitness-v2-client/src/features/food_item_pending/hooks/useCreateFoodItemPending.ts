import useMutateQuery from "~/features/shared/hooks/useMutateQuery";
import { QUERY_KEYS } from "~/lib/reactQuery";

interface ErrorResponseBody extends Error {
  message: string;
}

function useCreateFoodItemPending() {
  return useMutateQuery<unknown, FoodItemsPending, ErrorResponseBody>(
    () => [
      {
        queryKey: QUERY_KEYS.FOOD_ITEMS_PENDING.GET_FOOD_ITEMS_PENDING,
        isBroadcast: true,
      },
      {
        queryKey: QUERY_KEYS.SCORE.GET_SCORE_BY_USER_ID,
        isBroadcast: false,
      },
    ],
    () => `/food_items_pending`,
    "post",
  );
}

export default useCreateFoodItemPending;

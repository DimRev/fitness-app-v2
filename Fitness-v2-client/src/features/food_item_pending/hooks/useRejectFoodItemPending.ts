import useMutateQuery from "~/features/shared/hooks/useMutateQuery";
import { QUERY_KEYS } from "~/lib/reactQuery";

type RejectFoodItemPendingRequestParams = {
  food_item_pending_id: string;
};

interface ErrorResponseBody extends Error {
  message: string;
}

type SuccessResponseBody = {
  message: string;
};

function useRejectFoodItemPending() {
  return useMutateQuery<
    RejectFoodItemPendingRequestParams,
    SuccessResponseBody,
    ErrorResponseBody
  >(
    () => [
      {
        queryKey: QUERY_KEYS.FOOD_ITEMS_PENDING.GET_FOOD_ITEMS_PENDING,
        isBroadcast: true,
      },
      {
        queryKey: QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS_INF_QUERY,
        isBroadcast: true,
      },
      {
        queryKey: QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS,
        isBroadcast: true,
      },
    ],
    (d) => `/food_items_pending/reject/${d.food_item_pending_id}`,
    "post",
  );
}

export default useRejectFoodItemPending;

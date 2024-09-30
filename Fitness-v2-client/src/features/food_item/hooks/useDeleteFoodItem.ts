import useMutateQuery from "~/features/shared/hooks/useMutateQuery";
import { QUERY_KEYS } from "~/lib/reactQuery";

type DeleteFoodItemRequestParams = {
  food_item_id: string;
};

interface ErrorResponseBody extends Error {
  message: string;
}

type SuccessResponseBody = {
  message: string;
};

function useDeleteFoodItem() {
  return useMutateQuery<
    DeleteFoodItemRequestParams,
    SuccessResponseBody,
    ErrorResponseBody
  >(
    () => [
      {
        queryKey: QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS,
        isBroadcast: true,
      },
      {
        queryKey: QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS_INF_QUERY,
        isBroadcast: true,
      },
    ],
    (d) => `/food_items/${d.food_item_id}`,
    "delete",
  );
}

export default useDeleteFoodItem;

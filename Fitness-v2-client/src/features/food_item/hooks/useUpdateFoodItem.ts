import useMutateQuery from "~/features/shared/hooks/useMutateQuery";
import { QUERY_KEYS } from "~/lib/reactQuery";
import { type FoodItemFormSchema } from "../foodItem.schema";

type DeleteFoodItemRequestParams = {
  food_item_id: string;
} & FoodItemFormSchema;

interface ErrorResponseBody extends Error {
  message: string;
}

function useUpdateFoodItem() {
  return useMutateQuery<
    DeleteFoodItemRequestParams,
    FoodItem,
    ErrorResponseBody
  >(
    (_d, v) => [
      {
        queryKey: QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS,
        isBroadcast: true,
      },
      {
        queryKey: QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS_INF_QUERY,
        isBroadcast: true,
      },
      {
        queryKey: QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS_BY_USER_ID,
        isBroadcast: true,
        params: { food_item_id: v.food_item_id },
      },
      {
        queryKey: QUERY_KEYS.CHART_DATA.GET_CHART_DATA_MEALS_CONSUMED,
        isBroadcast: false,
      },
      {
        queryKey: QUERY_KEYS.CALENDAR_DATA.GET_CALENDAR_DATA_BY_DATE,
        isBroadcast: false,
      },
    ],
    (d) => `/food_items/${d.food_item_id}`,
    "put",
  );
}

export default useUpdateFoodItem;

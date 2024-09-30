import useMutateQuery from "~/features/shared/hooks/useMutateQuery";
import { QUERY_KEYS } from "~/lib/reactQuery";

type CreateMealRequestBody = {
  name: string;
  description: string | null;
  image_url: string | null;
  food_items: {
    food_item_id: string;
    amount: number;
  }[];
};

interface ErrorResponseBody extends Error {
  message: string;
}

function useCreateMeal() {
  return useMutateQuery<
    CreateMealRequestBody,
    MealWithFoodItems,
    ErrorResponseBody
  >(
    () => [
      {
        queryKey: QUERY_KEYS.MEALS.GET_MEALS_BY_USER_ID,
        isBroadcast: false,
      },
    ],
    () => "/meals",
    "post",
  );
}

export default useCreateMeal;

import axios from "axios";
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "react-query";
import axiosInstance from "~/lib/axios";
import { QUERY_KEYS, USE_MUTATION_DEFAULT_OPTIONS } from "~/lib/reactQuery";

type ToggleFoodItemPendingRequestParams = {
  food_item_pending_id: string;
  limit: number;
  offset: number;
};

type ErrorResponseBody = {
  message: string;
};

type OptimisticUpdateContext = {
  previousFoodItemsPending: FoodItemPending[] | undefined;
};

function useToggleFoodItemPending(): UseMutationResult<
  FoodItemPending,
  Error,
  ToggleFoodItemPendingRequestParams,
  OptimisticUpdateContext
> {
  const queryClient = useQueryClient();

  return useMutation<
    FoodItemPending,
    Error,
    ToggleFoodItemPendingRequestParams,
    OptimisticUpdateContext
  >(toggleFoodItemPending, {
    ...USE_MUTATION_DEFAULT_OPTIONS,
    onMutate: async ({ food_item_pending_id, limit, offset }) => {
      await queryClient.cancelQueries([
        QUERY_KEYS.FOOD_ITEMS_PENDING.GET_FOOD_ITEMS_PENDING,
        { limit, offset },
      ]);

      const previousFoodItemsPending = queryClient.getQueryData<
        FoodItemPending[]
      >([
        QUERY_KEYS.FOOD_ITEMS_PENDING.GET_FOOD_ITEMS_PENDING,
        { limit, offset },
      ]);

      queryClient.setQueryData<FoodItemPending[]>(
        [
          QUERY_KEYS.FOOD_ITEMS_PENDING.GET_FOOD_ITEMS_PENDING,
          { limit, offset },
        ],
        (old) =>
          (old ?? []).map((foodItemPending) => {
            if (foodItemPending.id === food_item_pending_id) {
              return {
                ...foodItemPending,
                liked: !foodItemPending.liked,
                likes: foodItemPending.liked
                  ? foodItemPending.likes - 1
                  : foodItemPending.likes + 1,
              };
            }
            return foodItemPending;
          }),
      );

      return { previousFoodItemsPending };
    },
    onError: (err, { limit, offset }, context) => {
      if (context?.previousFoodItemsPending) {
        queryClient.setQueryData(
          [
            QUERY_KEYS.FOOD_ITEMS_PENDING.GET_FOOD_ITEMS_PENDING,
            { limit, offset },
          ],
          context.previousFoodItemsPending,
        );
      }
    },
    onSettled: (data, error, { limit, offset }) => {
      void queryClient.invalidateQueries([
        QUERY_KEYS.FOOD_ITEMS_PENDING.GET_FOOD_ITEMS_PENDING,
        { limit, offset },
      ]);
    },
  });
}

async function toggleFoodItemPending({
  food_item_pending_id,
}: ToggleFoodItemPendingRequestParams): Promise<FoodItemPending> {
  try {
    const response = await axiosInstance.post<FoodItemPending>(
      `/food_items_pending/toggle/${food_item_pending_id}`,
    );
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

export default useToggleFoodItemPending;

import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import useSocket from "~/features/socket/hooks/useSocket";
import axiosInstance from "~/lib/axios";
import { QUERY_KEYS, USE_MUTATION_DEFAULT_OPTIONS } from "~/lib/reactQuery";

type ToggleFoodItemPendingRequestParams = {
  food_item_pending_id: string;
  limit: number;
  offset: number;
  text_filter?: string | null;
};

type ErrorResponseBody = {
  message: string;
};

type OptimisticUpdateContext = {
  previousFoodItemsPending: FoodItemsPendingWithPages | undefined;
};

function useToggleFoodItemPending() {
  const queryClient = useQueryClient();

  const { sendSocketGroupMessage } = useSocket();

  return useMutation<
    FoodItemsPendingWithPages,
    Error,
    ToggleFoodItemPendingRequestParams,
    OptimisticUpdateContext
  >(toggleFoodItemPending, {
    ...USE_MUTATION_DEFAULT_OPTIONS,
    onMutate: async ({ food_item_pending_id, limit, offset, text_filter }) => {
      await queryClient.cancelQueries([
        QUERY_KEYS.FOOD_ITEMS_PENDING.GET_FOOD_ITEMS_PENDING,
        { limit, offset, text_filter },
      ]);

      // Snapshot the previous value
      const previousFoodItemsPending =
        queryClient.getQueryData<FoodItemsPendingWithPages>([
          QUERY_KEYS.FOOD_ITEMS_PENDING.GET_FOOD_ITEMS_PENDING,
          { limit, offset, text_filter },
        ]);

      // Optimistically update to the new value
      queryClient.setQueryData<FoodItemsPendingWithPages>(
        [
          QUERY_KEYS.FOOD_ITEMS_PENDING.GET_FOOD_ITEMS_PENDING,
          { limit, offset, text_filter },
        ],
        (old) => {
          const newFoodItemsPending = old!.food_items_pending.map(
            (foodItemPending) => {
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
            },
          );

          const sortedFoodItemsPending = newFoodItemsPending.sort(
            (a, b) => b.likes - a.likes,
          );

          return {
            total_pages: old!.total_pages,
            food_items_pending: sortedFoodItemsPending,
          };
        },
      );

      // Return a context with the previous data to rollback on error
      return { previousFoodItemsPending };
    },
    onSuccess: (_data, { limit, offset, text_filter }) => {
      const invalidateData: BroadcastData = {
        group: [QUERY_KEYS.FOOD_ITEMS_PENDING.GET_FOOD_ITEMS_PENDING],
        action: "invalidate",
        data: {
          limit,
          offset,
          text_filter,
        },
      };
      void sendSocketGroupMessage(
        QUERY_KEYS.FOOD_ITEMS_PENDING.GET_FOOD_ITEMS_PENDING,
        invalidateData,
      );
    },
    onError: (_err, { limit, offset }, context) => {
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
    onSettled: (_data, _error, { limit, offset }) => {
      void queryClient.invalidateQueries([
        QUERY_KEYS.FOOD_ITEMS_PENDING.GET_FOOD_ITEMS_PENDING,
        { limit, offset },
      ]);
    },
  });
}

async function toggleFoodItemPending({
  food_item_pending_id,
}: ToggleFoodItemPendingRequestParams): Promise<FoodItemsPendingWithPages> {
  try {
    const response = await axiosInstance.post<FoodItemsPendingWithPages>(
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

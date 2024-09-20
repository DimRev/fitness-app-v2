import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import useSocket from "~/features/socket/hooks/useSocket";
import axiosInstance from "~/lib/axios";
import { QUERY_KEYS, USE_MUTATION_DEFAULT_OPTIONS } from "~/lib/reactQuery";

type RejectFoodItemPendingRequestParams = {
  food_item_pending_id: string;
  limit: number;
  offset: number;
};

type ErrorResponseBody = {
  message: string;
};

type SuccessResponseBody = {
  message: string;
};

function useRejectFoodItemPending() {
  const queryClient = useQueryClient();
  const { sendSocketGroupMessage } = useSocket();

  return useMutation<
    SuccessResponseBody,
    Error,
    RejectFoodItemPendingRequestParams
  >(rejectFoodItemPending, {
    ...USE_MUTATION_DEFAULT_OPTIONS,
    onSuccess: (_data) => {
      const stringifiedData = JSON.stringify({
        group: QUERY_KEYS.FOOD_ITEMS_PENDING.GET_FOOD_ITEMS_PENDING,
        data: {},
      });
      void sendSocketGroupMessage(
        QUERY_KEYS.FOOD_ITEMS_PENDING.GET_FOOD_ITEMS_PENDING,
        `"${stringifiedData}"`,
      );

      void queryClient.invalidateQueries([
        QUERY_KEYS.FOOD_ITEMS_PENDING.GET_FOOD_ITEMS_PENDING,
        {},
      ]);
    },
  });
}

async function rejectFoodItemPending({
  food_item_pending_id,
}: RejectFoodItemPendingRequestParams): Promise<SuccessResponseBody> {
  try {
    const response = await axiosInstance.post<SuccessResponseBody>(
      `/food_items_pending/reject/${food_item_pending_id}`,
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

export default useRejectFoodItemPending;

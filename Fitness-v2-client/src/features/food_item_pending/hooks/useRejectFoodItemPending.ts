import axios from "axios";
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "react-query";
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

function useRejectFoodItemPending(): UseMutationResult<
  SuccessResponseBody,
  Error,
  RejectFoodItemPendingRequestParams
> {
  const queryClient = useQueryClient();

  return useMutation<
    SuccessResponseBody,
    Error,
    RejectFoodItemPendingRequestParams
  >(rejectFoodItemPending, {
    ...USE_MUTATION_DEFAULT_OPTIONS,
    onSuccess: (data, { limit, offset }) => {
      console.log(data);
      void queryClient.invalidateQueries([
        QUERY_KEYS.FOOD_ITEMS_PENDING.GET_FOOD_ITEMS_PENDING,
        { limit, offset },
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

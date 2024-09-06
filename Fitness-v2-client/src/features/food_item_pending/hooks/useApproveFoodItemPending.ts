import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "~/lib/axios";
import { QUERY_KEYS, USE_MUTATION_DEFAULT_OPTIONS } from "~/lib/reactQuery";

type ApproveFoodItemPendingRequestParams = {
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

function useApproveFoodItemPending() {
  const queryClient = useQueryClient();

  return useMutation<
    SuccessResponseBody,
    Error,
    ApproveFoodItemPendingRequestParams
  >(approveFoodItemPending, {
    ...USE_MUTATION_DEFAULT_OPTIONS,
    onSuccess: (_data, { limit, offset }) => {
      void queryClient.invalidateQueries([
        QUERY_KEYS.FOOD_ITEMS_PENDING.GET_FOOD_ITEMS_PENDING,
        { limit, offset },
      ]);
    },
  });
}

async function approveFoodItemPending({
  food_item_pending_id,
}: ApproveFoodItemPendingRequestParams): Promise<SuccessResponseBody> {
  try {
    const response = await axiosInstance.post<SuccessResponseBody>(
      `/food_items_pending/approve/${food_item_pending_id}`,
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

export default useApproveFoodItemPending;

import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "~/lib/axios";
import { QUERY_KEYS } from "~/lib/reactQuery";

type MarkNotificationAsReadBody = {
  type: string;
  food_item_pending_id?: string;
};

type MarkNotificationAsReadResponseBody = {
  message: string;
};

type ErrorResponseBody = {
  message: string;
};

function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  return useMutation<
    MarkNotificationAsReadResponseBody,
    Error,
    MarkNotificationAsReadBody
  >(removeConsumedMeal, {
    onSuccess: (_data) => {
      void queryClient.invalidateQueries([
        QUERY_KEYS.NOTIFICATION.GET_NEW_USER_NOTIFICATIONS,
      ]);
    },
  });
}

async function removeConsumedMeal({
  type,
  food_item_pending_id,
}: MarkNotificationAsReadBody): Promise<MarkNotificationAsReadResponseBody> {
  try {
    const response =
      await axiosInstance.put<MarkNotificationAsReadResponseBody>(
        `/notifications/read`,
        {
          type,
          food_item_pending_id,
        },
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

export default useMarkNotificationAsRead;

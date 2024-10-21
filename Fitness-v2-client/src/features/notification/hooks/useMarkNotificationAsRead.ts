import useMutateQuery from "~/features/shared/hooks/useMutateQuery";
import { QUERY_KEYS } from "~/lib/reactQuery";

type MarkNotificationAsReadBody =
  | {
      type: "user-like-food-item-pending";
      food_item_pending_id?: string;
    }
  | {
      type:
        | "user-score-pending"
        | "user-score-approved"
        | "user-score-rejected";
      id: string;
    };

type MarkNotificationAsReadResponseBody = {
  message: string;
};

interface ErrorResponseBody extends Error {
  message: string;
}

function useMarkNotificationAsRead() {
  return useMutateQuery<
    MarkNotificationAsReadBody,
    MarkNotificationAsReadResponseBody,
    ErrorResponseBody
  >(
    () => {
      return [
        {
          queryKey: QUERY_KEYS.NOTIFICATION.GET_NEW_USER_NOTIFICATIONS,
          isBroadcast: false,
        },
      ];
    },
    () => "/notifications/read",
    "put",
  );
}

export default useMarkNotificationAsRead;

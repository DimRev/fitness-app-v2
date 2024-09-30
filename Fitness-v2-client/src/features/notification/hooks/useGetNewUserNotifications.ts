import { type UseQueryResult } from "react-query";
import useGetQuery from "~/features/shared/hooks/useGetQuery";
import { QUERY_KEYS } from "~/lib/reactQuery";

interface ErrorResponseBody extends Error {
  message: string;
}

function useGetNewUserNotifications(): UseQueryResult<
  NotificationNewFoodItemLikes[],
  Error
> {
  return useGetQuery<
    unknown,
    NotificationNewFoodItemLikes[],
    ErrorResponseBody
  >(
    undefined,
    QUERY_KEYS.NOTIFICATION.GET_NEW_USER_NOTIFICATIONS,
    "/notifications",
    true,
  );
}

export default useGetNewUserNotifications;

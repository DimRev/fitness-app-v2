import axios from "axios";
import { useQuery, type UseQueryResult } from "react-query";
import axiosInstance from "~/lib/axios";
import { QUERY_KEYS, USE_QUERY_DEFAULT_OPTIONS } from "~/lib/reactQuery";

type ErrorResponseBody = {
  message: string;
};

function useGetNewUserNotifications(): UseQueryResult<
  NotificationNewFoodItemLikes[],
  Error
> {
  return useQuery<NotificationNewFoodItemLikes[], Error>({
    ...USE_QUERY_DEFAULT_OPTIONS,
    queryKey: [QUERY_KEYS.NOTIFICATION.GET_NEW_USER_NOTIFICATIONS],

    queryFn: () => getMealByID(),
  });
}

async function getMealByID(): Promise<NotificationNewFoodItemLikes[]> {
  try {
    const response =
      await axiosInstance.get<NotificationNewFoodItemLikes[]>(`/notifications`);
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

export default useGetNewUserNotifications;

import useGetQuery from "~/features/shared/hooks/useGetQuery";
import { QUERY_KEYS } from "~/lib/reactQuery";

type GetUsersRequestBody = {
  limit: number;
  offset: number;
};

interface ErrorResponseBody extends Error {
  message: string;
}

function useGetUsers(params: GetUsersRequestBody) {
  return useGetQuery<GetUsersRequestBody, UserWithPages, ErrorResponseBody>(
    params,
    QUERY_KEYS.USERS.GET_USERS,
    "/users/admin",
  );
}

export default useGetUsers;

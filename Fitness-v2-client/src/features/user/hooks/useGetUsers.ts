import axios from "axios";
import { useQuery, type UseQueryResult } from "react-query";
import axiosInstance from "~/lib/axios";
import { QUERY_KEYS, USE_QUERY_DEFAULT_OPTIONS } from "~/lib/reactQuery";

type GetUsersRequestBody = {
  limit: number;
  offset: number;
};

type ErrorResponseBody = {
  message: string;
};

function useGetUsers(
  params: GetUsersRequestBody,
): UseQueryResult<UserWithPages, Error> {
  return useQuery<UserWithPages, Error>({
    ...USE_QUERY_DEFAULT_OPTIONS,
    queryKey: [
      QUERY_KEYS.USERS.GET_USERS,
      { limit: params.limit, offset: params.offset },
    ],

    queryFn: () => getUsers(params),
    enabled: !!params,
  });
}

async function getUsers({
  limit,
  offset,
}: GetUsersRequestBody): Promise<UserWithPages> {
  try {
    const response = await axiosInstance.get<UserWithPages>(`/users/admin`, {
      params: { limit, offset },
    });
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

export default useGetUsers;

import axios from "axios";
import { useLayoutEffect } from "react";
import { useQuery, useQueryClient, type UseQueryResult } from "react-query";
import useSocket from "~/features/socket/hooks/useSocket";
import axiosInstance from "~/lib/axios";
import { QUERY_KEYS, USE_QUERY_DEFAULT_OPTIONS } from "~/lib/reactQuery";
import {
  type BroadcastData,
  type Message,
  parseSocketData,
} from "~/lib/socket";

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
  const { joinSocketGroup, leaveSocketGroup, socket } = useSocket();
  const queryClient = useQueryClient();
  useLayoutEffect(() => {
    void joinSocketGroup(QUERY_KEYS.USERS.GET_USERS);
    if (socket) {
      try {
        socket.onmessage = (event: MessageEvent<string>) => {
          const message = JSON.parse(event.data) as Message;
          switch (message.action) {
            case "broadcast-group":
            case "broadcast-global":
            case "broadcast-all":
              if (message.data) {
                const broadcastData = parseSocketData<BroadcastData>(
                  message.data,
                );
                console.log("Received data:", broadcastData);
                if (broadcastData.group === QUERY_KEYS.USERS.GET_USERS) {
                  void queryClient.invalidateQueries([
                    QUERY_KEYS.USERS.GET_USERS,
                    broadcastData.data,
                  ]);
                }
              }
              break;
          }
        };
      } catch (err) {
        console.log("Failed to parse WebSocket message", err);
      }
    }
    return () => {
      void leaveSocketGroup(QUERY_KEYS.USERS.GET_USERS);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

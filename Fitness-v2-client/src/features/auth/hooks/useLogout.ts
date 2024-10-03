import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import useSocket from "~/features/socket/hooks/useSocket";
import axiosInstance from "~/lib/axios";

type ErrorResponseBody = {
  message: string;
};

type LogoutResponseBody = {
  message: string;
};

function useLogout() {
  const queryClient = useQueryClient();
  const { signOutSocket } = useSocket();

  return useMutation<LogoutResponseBody, Error, void>(logout, {
    onSuccess: async () => {
      /*
        We need the timeout because the logout isn't closing the socket
        It drops the user attached to the socket and leaves the groups that
        that socket was included in, so in order to let that set in we wait a bit
      */
      void signOutSocket();
      setTimeout(() => {
        void queryClient.invalidateQueries();
      }, 500);
    },
  });
}

async function logout(): Promise<LogoutResponseBody> {
  try {
    const response =
      await axiosInstance.post<LogoutResponseBody>("/auth/logout");
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

export default useLogout;

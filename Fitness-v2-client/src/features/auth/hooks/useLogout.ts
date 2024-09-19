import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import useSocket from "~/features/socket/hooks/useSocket";
import axiosInstance from "~/lib/axios";
import { USE_MUTATION_DEFAULT_OPTIONS } from "~/lib/reactQuery";

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
    ...USE_MUTATION_DEFAULT_OPTIONS,
    onSuccess: async () => {
      void signOutSocket();
      await queryClient.invalidateQueries();
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

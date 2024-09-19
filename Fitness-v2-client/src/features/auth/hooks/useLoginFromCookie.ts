import axios from "axios";
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "react-query";
import useSocket from "~/features/socket/hooks/useSocket";
import axiosInstance from "~/lib/axios";
import { USE_MUTATION_DEFAULT_OPTIONS } from "~/lib/reactQuery";

type ErrorResponseBody = {
  message: string;
};

function useLoginFromCookie(): UseMutationResult<AuthUser, Error, void> {
  const { signInSocket } = useSocket();
  const queryClient = useQueryClient();

  return useMutation<AuthUser, Error, void>(loginFromCookie, {
    ...USE_MUTATION_DEFAULT_OPTIONS,
    retry: false,
    onSuccess: async (data) => {
      void signInSocket(data.email);
      await queryClient.invalidateQueries();
    },
  });
}

async function loginFromCookie(): Promise<AuthUser> {
  try {
    const response = await axiosInstance.post<AuthUser>(
      "/auth/loginFromCookie",
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

export default useLoginFromCookie;

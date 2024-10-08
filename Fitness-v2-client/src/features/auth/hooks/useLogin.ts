import axios from "axios";
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "react-query";
import useSocket from "~/features/socket/hooks/useSocket";
import axiosInstance from "~/lib/axios";

type LoginRequestBody = {
  email: string;
  password: string;
};

type ErrorResponseBody = {
  message: string;
};

function useLogin(): UseMutationResult<AuthUser, Error, LoginRequestBody> {
  const queryClient = useQueryClient();
  const { signInSocket } = useSocket();

  return useMutation<AuthUser, Error, LoginRequestBody>(login, {
    onSuccess: async (data) => {
      await queryClient.invalidateQueries();
      void signInSocket(data.email);
    },
  });
}

async function login({ email, password }: LoginRequestBody): Promise<AuthUser> {
  try {
    const response = await axiosInstance.post<AuthUser>("/auth/login", {
      email,
      password,
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

export default useLogin;

import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import useSocket from "~/features/socket/hooks/useSocket";
import axiosInstance from "~/lib/axios";

type RegisterRequestBody = {
  email: string;
  password: string;
  username: string;
};

type ErrorResponseBody = {
  message: string;
};

function useRegister() {
  const queryClient = useQueryClient();
  const { signInSocket } = useSocket();
  return useMutation<AuthUser, Error, RegisterRequestBody>(register, {
    onSuccess: async (data) => {
      void signInSocket(data.email);
      await queryClient.invalidateQueries();
    },
  });
}

async function register({
  email,
  password,
  username,
}: RegisterRequestBody): Promise<AuthUser> {
  try {
    const response = await axiosInstance.post<AuthUser>("/auth/register", {
      email,
      password,
      username,
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

export default useRegister;

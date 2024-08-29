import axios from "axios";
import { useMutation, type UseMutationResult } from "react-query";
import axiosInstance from "~/lib/axios";

type LoginRequestBody = {
  email: string;
  password: string;
};

type ErrorResponseBody = {
  message: string;
};

function useLogin(): UseMutationResult<User, Error, LoginRequestBody> {
  return useMutation<User, Error, LoginRequestBody>(login);
}

async function login({ email, password }: LoginRequestBody): Promise<User> {
  try {
    const response = await axiosInstance.post<User>("/auth/login", {
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

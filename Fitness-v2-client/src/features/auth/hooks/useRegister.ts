import axios from "axios";
import { useMutation, type UseMutationResult } from "react-query";
import axiosInstance from "~/lib/axios";

type RegisterRequestBody = {
  email: string;
  password: string;
  username: string;
};

type ErrorResponseBody = {
  message: string;
};

function useRegister(): UseMutationResult<User, Error, RegisterRequestBody> {
  return useMutation<User, Error, RegisterRequestBody>(register);
}

async function register({
  email,
  password,
  username,
}: RegisterRequestBody): Promise<User> {
  try {
    const response = await axiosInstance.post<User>("/auth/register", {
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

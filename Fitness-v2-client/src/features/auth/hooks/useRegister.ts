import axios from "axios";
import { useMutation } from "react-query";
import axiosInstance from "~/lib/axios";
import { USE_MUTATION_DEFAULT_OPTIONS } from "~/lib/reactQuery";

type RegisterRequestBody = {
  email: string;
  password: string;
  username: string;
};

type ErrorResponseBody = {
  message: string;
};

function useRegister() {
  return useMutation<User, Error, RegisterRequestBody>(register, {
    ...USE_MUTATION_DEFAULT_OPTIONS,
  });
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

import axios from "axios";
import { useMutation, type UseMutationResult } from "react-query";
import axiosInstance from "~/lib/axios";

type ErrorResponseBody = {
  message: string;
};

type LogoutResponseBody = {
  message: string;
};

function useLogout(): UseMutationResult<LogoutResponseBody, Error, void> {
  return useMutation<LogoutResponseBody, Error, void>(logout);
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

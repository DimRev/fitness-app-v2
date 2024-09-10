import axios from "axios";
import { useMutation, type UseMutationResult } from "react-query";
import axiosInstance from "~/lib/axios";
import { USE_MUTATION_DEFAULT_OPTIONS } from "~/lib/reactQuery";

type ErrorResponseBody = {
  message: string;
};

function useLoginFromCookie(): UseMutationResult<AuthUser, Error, void> {
  return useMutation<AuthUser, Error, void>(loginFromCookie, {
    ...USE_MUTATION_DEFAULT_OPTIONS,
    retry: false,
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

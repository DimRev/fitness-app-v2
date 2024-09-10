import axios from "axios";
import { useMutation } from "react-query";
import axiosInstance from "~/lib/axios";
import { USE_MUTATION_DEFAULT_OPTIONS } from "~/lib/reactQuery";

type ErrorResponseBody = {
  message: string;
};

type LoginRequestBody = {
  session_token: string;
};

function useLoginFromSession() {
  return useMutation<AuthUser, Error, LoginRequestBody>(loginFromSession, {
    ...USE_MUTATION_DEFAULT_OPTIONS,
    retry: false,
  });
}

async function loginFromSession({
  session_token,
}: LoginRequestBody): Promise<AuthUser> {
  try {
    const response = await axiosInstance.post<AuthUser>(
      "/auth/loginFromSession",
      {
        session_token,
      },
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

export default useLoginFromSession;

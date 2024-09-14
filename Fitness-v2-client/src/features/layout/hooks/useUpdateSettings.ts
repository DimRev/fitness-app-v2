import axios from "axios";
import { useMutation } from "react-query";
import axiosInstance from "~/lib/axios";
import { USE_MUTATION_DEFAULT_OPTIONS } from "~/lib/reactQuery";

type UpdateSettingsRequestBody = {
  username: string;
  email: string;
  image_url: string | null;
};

type ErrorResponseBody = {
  message: string;
};

function useUpdateSettings() {
  return useMutation<AuthUser, Error, UpdateSettingsRequestBody>(
    updateSettings,
    {
      ...USE_MUTATION_DEFAULT_OPTIONS,
    },
  );
}

async function updateSettings({
  email,
  image_url,
  username,
}: UpdateSettingsRequestBody): Promise<AuthUser> {
  try {
    const response = await axiosInstance.put<AuthUser>(`/users`, {
      email,
      image_url,
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

export default useUpdateSettings;

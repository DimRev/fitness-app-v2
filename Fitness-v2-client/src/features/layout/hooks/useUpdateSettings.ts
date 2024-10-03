import axios from "axios";
import { useMutation } from "react-query";
import axiosInstance from "~/lib/axios";

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

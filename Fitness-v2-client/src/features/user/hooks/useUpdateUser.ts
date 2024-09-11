import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "~/lib/axios";
import { QUERY_KEYS, USE_MUTATION_DEFAULT_OPTIONS } from "~/lib/reactQuery";
import { type UserEditFormSchema } from "../user.schema";

type ErrorResponseBody = {
  message: string;
};

function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation<User, Error, UserEditFormSchema & { userId: string }>(
    updateUser,
    {
      ...USE_MUTATION_DEFAULT_OPTIONS,
      onSuccess: () => {
        void queryClient.invalidateQueries([QUERY_KEYS.USERS.GET_USERS]);
      },
    },
  );
}

async function updateUser({
  email,
  image_url,
  username,
  role,
  userId,
}: UserEditFormSchema & { userId: string }): Promise<User> {
  try {
    const response = await axiosInstance.put<User>(`/users/admin/${userId}`, {
      email,
      image_url,
      username,
      role,
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

export default useUpdateUser;

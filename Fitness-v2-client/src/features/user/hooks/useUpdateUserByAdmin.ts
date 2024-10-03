import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "~/lib/axios";
import { QUERY_KEYS } from "~/lib/reactQuery";
import { type UserEditFormSchema } from "../user.schema";
import useSocket from "~/features/socket/hooks/useSocket";

type ErrorResponseBody = {
  message: string;
};

function useUpdateUserByAdmin() {
  const queryClient = useQueryClient();
  const { sendSocketGroupMessage } = useSocket();
  return useMutation<User, Error, UserEditFormSchema & { userId: string }>(
    updateUserByAdmin,
    {
      retry: false,
      onSuccess: async () => {
        const invalidateData: BroadcastData = {
          group: [QUERY_KEYS.USERS.GET_USERS],
          action: "invalidate",
          data: {},
        };
        await sendSocketGroupMessage(
          QUERY_KEYS.USERS.GET_USERS,
          invalidateData,
        );
        void queryClient.invalidateQueries([QUERY_KEYS.USERS.GET_USERS]);
      },
    },
  );
}

async function updateUserByAdmin({
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

export default useUpdateUserByAdmin;

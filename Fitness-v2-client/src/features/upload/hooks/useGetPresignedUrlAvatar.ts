import axios from "axios";
import { useMutation, type UseMutationResult } from "react-query";
import axiosInstance from "~/lib/axios";

type GetPresignedUrlAvatarRequestBody = {
  file_name: string;
  file_type: string;
  file_size: number;
  check_sum: string;
};

type GetPresignedUrlAvatarRespBody = {
  presigned_url: string;
};

type ErrorResponseBody = {
  message: string;
};

function useGetPresignedUrlAvatar(): UseMutationResult<
  GetPresignedUrlAvatarRespBody,
  Error,
  GetPresignedUrlAvatarRequestBody
> {
  return useMutation<
    GetPresignedUrlAvatarRespBody,
    Error,
    GetPresignedUrlAvatarRequestBody
  >(getPresignedUrlAvatar);
}

async function getPresignedUrlAvatar({
  file_name,
  file_type,
  file_size,
  check_sum,
}: GetPresignedUrlAvatarRequestBody): Promise<GetPresignedUrlAvatarRespBody> {
  try {
    const response = await axiosInstance.post<GetPresignedUrlAvatarRespBody>(
      "/upload/presigned_avatar_url",
      {
        file_name,
        file_type,
        file_size,
        check_sum,
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

export default useGetPresignedUrlAvatar;

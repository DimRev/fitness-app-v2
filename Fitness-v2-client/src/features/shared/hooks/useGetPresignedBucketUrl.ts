import axios from "axios";
import { useMutation, type UseMutationResult } from "react-query";
import axiosInstance from "~/lib/axios";
import { USE_MUTATION_DEFAULT_OPTIONS } from "~/lib/reactQuery";

type GetPresignedBucketUrlRequestBody = {
  file_name: string;
  file_type: string;
  file_size: number;
  check_sum: string;
};

type GetPresignedBucketUrlRespBody = {
  presigned_url: string;
};

type ErrorResponseBody = {
  message: string;
};

function useGetPresignedBucketUrl(): UseMutationResult<
  GetPresignedBucketUrlRespBody,
  Error,
  GetPresignedBucketUrlRequestBody
> {
  return useMutation<
    GetPresignedBucketUrlRespBody,
    Error,
    GetPresignedBucketUrlRequestBody
  >(getPresignedBucketUrl, {
    ...USE_MUTATION_DEFAULT_OPTIONS,
    onSuccess: (data) => {
      console.log(data);
    },
  });
}

async function getPresignedBucketUrl({
  file_name,
  file_type,
  file_size,
  check_sum,
}: GetPresignedBucketUrlRequestBody): Promise<GetPresignedBucketUrlRespBody> {
  try {
    const response = await axiosInstance.post<GetPresignedBucketUrlRespBody>(
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

export default useGetPresignedBucketUrl;

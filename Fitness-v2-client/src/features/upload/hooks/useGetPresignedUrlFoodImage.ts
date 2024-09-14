import axios from "axios";
import { useMutation, type UseMutationResult } from "react-query";
import axiosInstance from "~/lib/axios";
import { USE_MUTATION_DEFAULT_OPTIONS } from "~/lib/reactQuery";

type GetPresignedUrlFoodImageRequestBody = {
  file_name: string;
  file_type: string;
  file_size: number;
  check_sum: string;
};

type GetPresignedUrlFoodImageRespBody = {
  presigned_url: string;
};

type ErrorResponseBody = {
  message: string;
};

function useGetPresignedUrlFoodImage(): UseMutationResult<
  GetPresignedUrlFoodImageRespBody,
  Error,
  GetPresignedUrlFoodImageRequestBody
> {
  return useMutation<
    GetPresignedUrlFoodImageRespBody,
    Error,
    GetPresignedUrlFoodImageRequestBody
  >(getPresignedUrlFoodImage, {
    ...USE_MUTATION_DEFAULT_OPTIONS,
  });
}

async function getPresignedUrlFoodImage({
  file_name,
  file_type,
  file_size,
  check_sum,
}: GetPresignedUrlFoodImageRequestBody): Promise<GetPresignedUrlFoodImageRespBody> {
  try {
    const response = await axiosInstance.post<GetPresignedUrlFoodImageRespBody>(
      "/upload/presigned_food_image_url",
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

export default useGetPresignedUrlFoodImage;

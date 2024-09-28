import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "~/lib/axios";
import { QUERY_KEYS } from "~/lib/reactQuery";

type CreateMeasurementRequestBody = {
  weight: string;
  height: string;
};

type ErrorResponseBody = {
  message: string;
};

function useCreateMeasurement() {
  const queryClient = useQueryClient();
  return useMutation<Measurement, Error, CreateMeasurementRequestBody>(
    createMeasurement,
    {
      onSuccess: () => {
        void queryClient.invalidateQueries([
          QUERY_KEYS.MEASUREMENT.GET_CHECK_TODAY_MEASUREMENT,
        ]);
        void queryClient.invalidateQueries([
          QUERY_KEYS.MEASUREMENT.GET_MEASUREMENTS_BY_USER_ID,
        ]);
        void queryClient.invalidateQueries([
          QUERY_KEYS.CHART_DATA.GET_CHART_DATA_MEASUREMENTS,
        ]);
      },
    },
  );
}

async function createMeasurement({
  weight,
  height,
}: CreateMeasurementRequestBody): Promise<Measurement> {
  try {
    const response = await axiosInstance.post<Measurement>(`/measurements`, {
      weight,
      height,
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

export default useCreateMeasurement;

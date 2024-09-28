import axios from "axios";
import { useEffect } from "react";
import { useQuery } from "react-query";
import useSocket from "~/features/socket/hooks/useSocket";
import axiosInstance from "~/lib/axios";
import { QUERY_KEYS, USE_QUERY_DEFAULT_OPTIONS } from "~/lib/reactQuery";

type GetFoodItemsRequestBody = {
  never?: never;
};

type ErrorResponseBody = {
  message: string;
};

function useGetCheckTodayMeasurement(params: GetFoodItemsRequestBody) {
  const { joinSocketGroup, leaveSocketGroup } = useSocket();
  useEffect(() => {
    void joinSocketGroup(QUERY_KEYS.MEASUREMENT.GET_CHECK_TODAY_MEASUREMENT);
    return () => {
      void leaveSocketGroup(QUERY_KEYS.MEASUREMENT.GET_CHECK_TODAY_MEASUREMENT);
    };
  }, [joinSocketGroup, leaveSocketGroup]);
  return useQuery<MeasurementToday, Error>({
    ...USE_QUERY_DEFAULT_OPTIONS,
    queryKey: [QUERY_KEYS.MEASUREMENT.GET_CHECK_TODAY_MEASUREMENT],

    queryFn: () => getFoodItemsPending(params),
  });
}

async function getFoodItemsPending({
  never: _never,
}: GetFoodItemsRequestBody): Promise<MeasurementToday> {
  try {
    const response =
      await axiosInstance.get<MeasurementToday>(`/measurements/check`);
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

export default useGetCheckTodayMeasurement;

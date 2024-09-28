import axios from "axios";
import { useEffect } from "react";
import { useQuery } from "react-query";
import useSocket from "~/features/socket/hooks/useSocket";
import axiosInstance from "~/lib/axios";
import { QUERY_KEYS, USE_QUERY_DEFAULT_OPTIONS } from "~/lib/reactQuery";

type GetChartDataMeasurementsRequestBody = {
  nothing?: string;
};

type ErrorResponseBody = {
  message: string;
};

function useGetChartDataMeasurements(
  params: GetChartDataMeasurementsRequestBody,
) {
  const { joinSocketGroup, leaveSocketGroup } = useSocket();
  useEffect(() => {
    void joinSocketGroup(QUERY_KEYS.CHART_DATA.GET_CHART_DATA_MEASUREMENTS);
    return () => {
      void leaveSocketGroup(QUERY_KEYS.CHART_DATA.GET_CHART_DATA_MEASUREMENTS);
    };
  }, [joinSocketGroup, leaveSocketGroup]);
  return useQuery<MeasurementsChartData[], Error>({
    ...USE_QUERY_DEFAULT_OPTIONS,
    queryKey: [QUERY_KEYS.CHART_DATA.GET_CHART_DATA_MEASUREMENTS, {}],

    queryFn: () => getChartDataMeasurement(params),
    enabled: !!params,
  });
}

async function getChartDataMeasurement({
  nothing,
}: GetChartDataMeasurementsRequestBody): Promise<MeasurementsChartData[]> {
  try {
    const response = await axiosInstance.get<MeasurementsChartData[]>(
      `/charts/measurements`,
      {
        params: { nothing },
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

export default useGetChartDataMeasurements;

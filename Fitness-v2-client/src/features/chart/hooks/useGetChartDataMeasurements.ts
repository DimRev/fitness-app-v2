import useGetQuery from "~/features/shared/hooks/useGetQuery";
import { QUERY_KEYS } from "~/lib/reactQuery";

interface ErrorResponseBody extends Error {
  message: string;
}

function useGetChartDataMeasurements() {
  return useGetQuery<unknown, MeasurementsChartData[], ErrorResponseBody>(
    undefined,
    QUERY_KEYS.CHART_DATA.GET_CHART_DATA_MEASUREMENTS,
    "/charts/measurements",
    true,
  );
}

export default useGetChartDataMeasurements;

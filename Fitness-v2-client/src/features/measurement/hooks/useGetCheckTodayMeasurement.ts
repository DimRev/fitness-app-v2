import useGetQuery from "~/features/shared/hooks/useGetQuery";
import { QUERY_KEYS } from "~/lib/reactQuery";

interface ErrorResponseBody extends Error {
  message: string;
}

function useGetCheckTodayMeasurement() {
  return useGetQuery<unknown, MeasurementToday, ErrorResponseBody>(
    undefined,
    QUERY_KEYS.MEASUREMENT.GET_CHECK_TODAY_MEASUREMENT,
    "/measurements/check",
    true,
  );
}

export default useGetCheckTodayMeasurement;

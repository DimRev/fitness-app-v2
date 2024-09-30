import useGetQuery from "~/features/shared/hooks/useGetQuery";
import { QUERY_KEYS } from "~/lib/reactQuery";

interface ErrorResponseBody extends Error {
  message: string;
}

function useGetMeasurementsByUserID() {
  return useGetQuery<unknown, Measurement[], ErrorResponseBody>(
    undefined,
    QUERY_KEYS.MEASUREMENT.GET_MEASUREMENTS_BY_USER_ID,
    "/measurements",
    true,
  );
}

export default useGetMeasurementsByUserID;

import useMutateQuery from "~/features/shared/hooks/useMutateQuery";
import { QUERY_KEYS } from "~/lib/reactQuery";

export type CreateMeasurementRequestBody = {
  weight: string;
  height: string;
};

interface ErrorResponseBody extends Error {
  message: string;
}

function useCreateMeasurement() {
  return useMutateQuery<
    CreateMeasurementRequestBody,
    Measurement,
    ErrorResponseBody
  >(
    () => [
      {
        queryKey: QUERY_KEYS.MEASUREMENT.GET_CHECK_TODAY_MEASUREMENT,
        isBroadcast: false,
      },
      {
        queryKey: QUERY_KEYS.MEASUREMENT.GET_MEASUREMENTS_BY_USER_ID,
        isBroadcast: false,
      },
      {
        queryKey: QUERY_KEYS.CHART_DATA.GET_CHART_DATA_MEASUREMENTS,
        isBroadcast: false,
      },
    ],
    () => "/measurements",
    "post",
  );
}

export default useCreateMeasurement;

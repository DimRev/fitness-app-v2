import useGetQuery from "~/features/shared/hooks/useGetQuery";
import { QUERY_KEYS } from "~/lib/reactQuery";

interface ErrorResponseBody extends Error {
  message: string;
}

function useGetChartDataMealsConsumed() {
  return useGetQuery<unknown, MealsConsumedChartData[], ErrorResponseBody>(
    undefined,
    QUERY_KEYS.CHART_DATA.GET_CHART_DATA_MEALS_CONSUMED,
    "/charts/meals",
    true,
  );
}

export default useGetChartDataMealsConsumed;

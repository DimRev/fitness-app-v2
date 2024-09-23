import axios from "axios";
import { useEffect } from "react";
import { useQuery } from "react-query";
import useSocket from "~/features/socket/hooks/useSocket";
import axiosInstance from "~/lib/axios";
import { QUERY_KEYS, USE_QUERY_DEFAULT_OPTIONS } from "~/lib/reactQuery";

type GetFoodItemsRequestBody = {
  nothing?: string;
};

type ErrorResponseBody = {
  message: string;
};

function useGetChartDataMealsConsumed(params: GetFoodItemsRequestBody) {
  const { joinSocketGroup, leaveSocketGroup } = useSocket();
  useEffect(() => {
    void joinSocketGroup(QUERY_KEYS.CHART_DATA.GET_CHART_DATA_MEALS_CONSUMED);
    return () => {
      void leaveSocketGroup(
        QUERY_KEYS.CHART_DATA.GET_CHART_DATA_MEALS_CONSUMED,
      );
    };
  }, [joinSocketGroup, leaveSocketGroup]);
  return useQuery<MealsConsumedChartData[], Error>({
    ...USE_QUERY_DEFAULT_OPTIONS,
    queryKey: [QUERY_KEYS.CHART_DATA.GET_CHART_DATA_MEALS_CONSUMED, {}],

    queryFn: () => getFoodItemsPending(params),
    enabled: !!params,
  });
}

async function getFoodItemsPending({
  nothing,
}: GetFoodItemsRequestBody): Promise<MealsConsumedChartData[]> {
  try {
    const response = await axiosInstance.get<MealsConsumedChartData[]>(
      `/charts/meals`,
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

export default useGetChartDataMealsConsumed;

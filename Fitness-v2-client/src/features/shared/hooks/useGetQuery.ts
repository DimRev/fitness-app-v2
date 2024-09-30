import axios from "axios";
import { useEffect } from "react";
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "react-query";
import useSocket from "~/features/socket/hooks/useSocket";
import axiosInstance from "~/lib/axios";
import {
  type ConstQueryKeys,
  USE_QUERY_DEFAULT_OPTIONS,
} from "~/lib/reactQuery";

function useGetQuery<ParamsType, ResponseType, ErrorType extends Error>(
  params: ParamsType,
  queryKey: ConstQueryKeys,
  route: string,
  enabledWithoutParams = true,
  options?: UseQueryOptions<ResponseType, Error>,
): UseQueryResult<ResponseType, Error> {
  const { joinSocketGroup, leaveSocketGroup } = useSocket();
  useEffect(() => {
    void joinSocketGroup(queryKey);
    return () => {
      void leaveSocketGroup(queryKey);
    };
  }, [joinSocketGroup, leaveSocketGroup, queryKey]);
  return useQuery<ResponseType, Error>({
    ...USE_QUERY_DEFAULT_OPTIONS,
    ...options,
    queryKey: [queryKey, params],

    queryFn: () =>
      getQuery<ParamsType, ResponseType, ErrorType>(
        params,
        route,
        enabledWithoutParams,
      ),
    enabled: enabledWithoutParams || !!params,
  });
}

async function getQuery<ParamsType, ResponseType, ErrorType extends Error>(
  params: ParamsType,
  route: string,
  enabledWithoutParams: boolean,
): Promise<ResponseType> {
  try {
    const response = await axiosInstance.get<ResponseType>(route, {
      params: enabledWithoutParams ? undefined : params,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errResponse = error.response.data as ErrorType;
      console.error(`${error.response.status} | ${errResponse.message}`);
      throw new Error(errResponse.message);
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
}

export default useGetQuery;

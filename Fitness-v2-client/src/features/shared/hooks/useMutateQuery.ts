import axios, { type AxiosResponse } from "axios";
import {
  type MutateOptions,
  type QueryClient,
  useMutation,
  useQueryClient,
} from "react-query";
import useSocket from "~/features/socket/hooks/useSocket";
import axiosInstance from "~/lib/axios";

function useMutateQuery<ReqBodyType, ResponseType, ErrorType extends Error>(
  queryKeyParamsArrayCB: (
    d: ResponseType,
    v: ReqBodyType,
    c: unknown,
  ) => {
    queryKey: string;
    params?: ParamsAsData;
    isBroadcast?: boolean;
  }[],
  routeCB: (d: ReqBodyType) => string,
  method?: "post" | "put" | "delete",
  options?: MutateOptions<ResponseType, ErrorType, ReqBodyType>,
) {
  const queryClient = useQueryClient();
  const { sendSocketGroupMessage } = useSocket();
  return useMutation<ResponseType, ErrorType, ReqBodyType>(
    (reqBody) =>
      createFoodItemPending<ReqBodyType, ResponseType, ErrorType>(
        reqBody,
        routeCB(reqBody),
        method,
      ),
    {
      ...options,
      onSuccess: (data, variables, context) => {
        invalidateSocketAndQueryClient<ReqBodyType, ResponseType>(
          queryClient,
          sendSocketGroupMessage,
          queryKeyParamsArrayCB,
          data,
          variables,
          context,
        );
      },
    },
  );
}

async function createFoodItemPending<
  ReqBodyType,
  ResponseType,
  ErrorType extends Error,
>(
  reqBody: ReqBodyType,
  route: string,
  method?: "post" | "put" | "delete",
): Promise<ResponseType> {
  try {
    let response: AxiosResponse<ResponseType>;
    switch (method) {
      case "delete":
        response = await axiosInstance.delete<ResponseType>(route, {
          params: reqBody,
        });
        break;
      case "put":
        response = await axiosInstance.put<ResponseType>(route, reqBody);
        break;
      default: // default == "post"
        response = await axiosInstance.post<ResponseType>(route, reqBody);
        break;
    }
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

function invalidateSocketAndQueryClient<T, U>(
  queryClient: QueryClient,
  sendSocketGroupMessage: (group: string, msg: BroadcastData) => Promise<void>,
  queryKeyParamsArrayCB: (
    d: U,
    v: T,
    c: unknown,
  ) => {
    queryKey: string;
    params?: ParamsAsData;
    isBroadcast?: boolean;
  }[],
  data: U,
  variables: T,
  context: unknown,
) {
  const queryKeyParamsArray = queryKeyParamsArrayCB(data, variables, context);
  queryKeyParamsArray.forEach(({ queryKey, params, isBroadcast }) => {
    const invalidateData: BroadcastData = {
      group: [queryKey],
      action: "invalidate",
      data: params ?? {},
    };

    if (isBroadcast) {
      void sendSocketGroupMessage(queryKey, invalidateData);
    }
    if (params) {
      void queryClient.invalidateQueries([queryKey, params]);
    } else {
      void queryClient.invalidateQueries([queryKey]);
    }
  });
}

export default useMutateQuery;

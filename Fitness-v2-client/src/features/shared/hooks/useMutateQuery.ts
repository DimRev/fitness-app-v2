import axios from "axios";
import { type QueryClient, useMutation, useQueryClient } from "react-query";
import useSocket from "~/features/socket/hooks/useSocket";
import axiosInstance from "~/lib/axios";
import { USE_MUTATION_DEFAULT_OPTIONS } from "~/lib/reactQuery";

function useMutateQuery<ReqBodyType, ResponseType, ErrorType extends Error>(
  queryKeyParamsArray: { queryKey: string; params?: ParamsAsData }[],
  route: string,
) {
  const queryClient = useQueryClient();
  const { sendSocketGroupMessage } = useSocket();
  return useMutation<ResponseType, ErrorType, ReqBodyType>(
    (reqBody) =>
      createFoodItemPending<ReqBodyType, ResponseType, ErrorType>(
        reqBody,
        route,
      ),
    {
      ...USE_MUTATION_DEFAULT_OPTIONS,
      onSuccess: () => {
        invalidateSocketAndQueryClient(
          queryClient,
          sendSocketGroupMessage,
          queryKeyParamsArray,
        );
      },
    },
  );
}

async function createFoodItemPending<
  ReqBodyType,
  ResponseType,
  ErrorType extends Error,
>(reqBody: ReqBodyType, route: string): Promise<ResponseType> {
  try {
    const response = await axiosInstance.post<ResponseType>(route, reqBody);
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

function invalidateSocketAndQueryClient(
  queryClient: QueryClient,
  sendSocketGroupMessage: (group: string, msg: BroadcastData) => Promise<void>,
  queryKeyParamsArray: { queryKey: string; params?: ParamsAsData }[],
  broadcastToSocket = true,
) {
  queryKeyParamsArray.forEach(({ queryKey, params }) => {
    const invalidateData: BroadcastData = {
      group: [queryKey],
      action: "invalidate",
      data: params ?? {},
    };

    if (broadcastToSocket) {
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

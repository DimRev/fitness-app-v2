import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import useSocket from "~/features/socket/hooks/useSocket";
import axiosInstance from "~/lib/axios";
import { QUERY_KEYS, USE_MUTATION_DEFAULT_OPTIONS } from "~/lib/reactQuery";

type DeleteFoodItemRequestParams = {
  food_item_id: string;
};

type ErrorResponseBody = {
  message: string;
};

type SuccessResponseBody = {
  message: string;
};

function useDeleteFoodItem() {
  const queryClient = useQueryClient();
  const { sendSocketGroupMessage } = useSocket();

  return useMutation<SuccessResponseBody, Error, DeleteFoodItemRequestParams>(
    deleteFoodItem,
    {
      ...USE_MUTATION_DEFAULT_OPTIONS,
      onSuccess: (_data) => {
        const stringifiedData = JSON.stringify({
          group: QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS,
          data: {},
        });

        void sendSocketGroupMessage(
          QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS,
          `"${stringifiedData}"`,
        );

        void sendSocketGroupMessage(
          QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS_INF_QUERY,
          `"${stringifiedData}"`,
        );

        void queryClient.invalidateQueries([
          QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS,
        ]);

        void queryClient.invalidateQueries([
          QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS_INF_QUERY,
        ]);
      },
    },
  );
}

async function deleteFoodItem({
  food_item_id,
}: DeleteFoodItemRequestParams): Promise<SuccessResponseBody> {
  try {
    const response = await axiosInstance.delete<SuccessResponseBody>(
      `/food_items/${food_item_id}`,
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

export default useDeleteFoodItem;

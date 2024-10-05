import { renderHook, waitFor } from "@testing-library/react";
import { act } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { QUERY_KEYS } from "~/lib/reactQuery";
import useDeleteFoodItem from "../useDeleteFoodItem";

// Mock the useSocket hook
const sendSocketGroupMessageMock = vi.fn();

vi.mock("~/features/socket/hooks/useSocket", () => {
  return {
    default: () => ({
      sendSocketGroupMessage: sendSocketGroupMessageMock,
    }),
  };
});

describe("useDeleteFoodItem", () => {
  const createTestQueryClient = () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
        mutations: {
          retry: false,
        },
      },
    });

  afterEach(() => {
    sendSocketGroupMessageMock.mockClear();
  });

  test("successful delete food item by id", async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result: useDeleteFoodItemResult } = renderHook(
      () => useDeleteFoodItem(),
      { wrapper },
    );

    await act(async () => {
      const mutationPromise = useDeleteFoodItemResult.current.mutateAsync({
        food_item_id: "1",
      });

      await mutationPromise;
    });

    await waitFor(() =>
      expect(useDeleteFoodItemResult.current.isSuccess).toBe(true),
    );

    expect(useDeleteFoodItemResult.current.data).toEqual({
      message: "Successfully deleted food item",
    });

    const invalidateAllFoodItemsData: BroadcastData = {
      group: [QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS],
      action: "invalidate",
      data: {},
    };
    expect(sendSocketGroupMessageMock).toHaveBeenCalledWith(
      QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS,
      invalidateAllFoodItemsData,
    );

    const invalidateAllFoodItemsInfQueryData: BroadcastData = {
      group: [QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS_INF_QUERY],
      action: "invalidate",
      data: {},
    };
    expect(sendSocketGroupMessageMock).toHaveBeenCalledWith(
      QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS_INF_QUERY,
      invalidateAllFoodItemsInfQueryData,
    );

    expect(sendSocketGroupMessageMock).not.toHaveBeenCalledWith(
      QUERY_KEYS.CHART_DATA.GET_CHART_DATA_MEALS_CONSUMED,
    );

    expect(sendSocketGroupMessageMock).not.toHaveBeenCalledWith(
      QUERY_KEYS.CHART_DATA.GET_CHART_DATA_MEASUREMENTS,
    );
  });

  test("fail to delete food item by id, not found", async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result: useDeleteFoodItemResult } = renderHook(
      () => useDeleteFoodItem(),
      { wrapper },
    );

    act(() =>
      useDeleteFoodItemResult.current.mutate({
        food_item_id: "5",
      }),
    );

    await waitFor(() =>
      expect(useDeleteFoodItemResult.current.isError).toBe(true),
    );

    expect(useDeleteFoodItemResult.current.error).toEqual(
      new Error("Failed to delete food item, food item not found"),
    );

    expect(sendSocketGroupMessageMock).not.toHaveBeenCalled();
  });
});

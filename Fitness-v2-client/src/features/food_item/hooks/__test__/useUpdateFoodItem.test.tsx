import { renderHook, waitFor } from "@testing-library/react";
import { act } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import useUpdateFoodItem from "../useUpdateFoodItem";
import { QUERY_KEYS } from "~/lib/reactQuery";

// Mock the useSocket hook
const sendSocketGroupMessageMock = vi.fn();

vi.mock("~/features/socket/hooks/useSocket", () => {
  return {
    default: () => ({
      sendSocketGroupMessage: sendSocketGroupMessageMock,
    }),
  };
});

describe("useUpdateFoodItem", () => {
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

  test("successful get food item by id", async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result: useUpdateFoodItemResult } = renderHook(
      () => useUpdateFoodItem(),
      { wrapper },
    );

    await act(async () => {
      const mutationPromise = useUpdateFoodItemResult.current.mutateAsync({
        food_item_id: "1",
        name: "test food item 1",
        calories: "1000",
        carbs: "1000",
        fat: "1000",
        protein: "1000",
        food_type: "protein",
        description: "test description 1",
        image_url: null,
      });

      // Wait for the mutation to start
      setTimeout(() => {
        expect(useUpdateFoodItemResult.current.isLoading).toBe(true);
      }, 300);

      await mutationPromise;
    });

    await waitFor(() =>
      expect(useUpdateFoodItemResult.current.isSuccess).toBe(true),
    );

    expect(useUpdateFoodItemResult.current.data).toEqual({
      id: "1",
      name: "test food item 1",
      calories: "1000",
      carbs: "1000",
      fat: "1000",
      protein: "1000",
      food_type: "protein",
      description: "test description 1",
      image_url: undefined,
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

    const invalidateAllFoodItemByID: BroadcastData = {
      group: [QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS_BY_ID],
      action: "invalidate",
      data: {
        food_item_id: "1",
      },
    };
    expect(sendSocketGroupMessageMock).toHaveBeenCalledWith(
      QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS_BY_ID,
      invalidateAllFoodItemByID,
    );

    expect(sendSocketGroupMessageMock).not.toHaveBeenCalledWith(
      QUERY_KEYS.CHART_DATA.GET_CHART_DATA_MEALS_CONSUMED,
    );

    expect(sendSocketGroupMessageMock).not.toHaveBeenCalledWith(
      QUERY_KEYS.CHART_DATA.GET_CHART_DATA_MEASUREMENTS,
    );
  });

  test("fail to get food item by id, not found", async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result: useUpdateFoodItemResult } = renderHook(
      () => useUpdateFoodItem(),
      { wrapper },
    );

    act(() =>
      useUpdateFoodItemResult.current.mutate({
        food_item_id: "5",
        name: "test food item 1",
        calories: "1000",
        carbs: "1000",
        fat: "1000",
        protein: "1000",
        food_type: "protein",
        description: "test description 1",
        image_url: null,
      }),
    );

    await waitFor(() =>
      expect(useUpdateFoodItemResult.current.isError).toBe(true),
    );

    expect(useUpdateFoodItemResult.current.error).toEqual(
      new Error("Failed update food item, food item not found"),
    );

    expect(sendSocketGroupMessageMock).not.toHaveBeenCalled();
  });
});

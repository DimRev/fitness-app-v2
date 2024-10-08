import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { QUERY_KEYS } from "~/lib/reactQuery";
import useRejectFoodItemPending from "../useRejectFoodItemPending";

const sendSocketGroupMessageMock = vi.fn();

vi.mock("~/features/socket/hooks/useSocket", () => {
  return {
    default: () => ({
      sendSocketGroupMessage: sendSocketGroupMessageMock,
    }),
  };
});

describe("useRejectFoodItemPending", () => {
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

  test("successful reject food item pending", async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result: useRejectFoodItemPendingResult } = renderHook(
      () => useRejectFoodItemPending(),
      { wrapper },
    );

    try {
      await act(async () => {
        const mutationPromise =
          useRejectFoodItemPendingResult.current.mutateAsync({
            food_item_pending_id: "1",
          });

        await mutationPromise;
      });

      await waitFor(() =>
        expect(useRejectFoodItemPendingResult.current.isSuccess).toBe(true),
      );

      expect(useRejectFoodItemPendingResult.current.data).toEqual({
        message: "Food item pending rejected",
      });
    } catch (err: any) {}

    const invalidateAllFoodItemsPendingData: BroadcastData = {
      group: [QUERY_KEYS.FOOD_ITEMS_PENDING.GET_FOOD_ITEMS_PENDING],
      action: "invalidate",
      data: {},
    };
    expect(sendSocketGroupMessageMock).toHaveBeenCalledWith(
      QUERY_KEYS.FOOD_ITEMS_PENDING.GET_FOOD_ITEMS_PENDING,
      invalidateAllFoodItemsPendingData,
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

    const invalidateAllFoodItemsData: BroadcastData = {
      group: [QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS],
      action: "invalidate",
      data: {},
    };
    expect(sendSocketGroupMessageMock).toHaveBeenCalledWith(
      QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS,
      invalidateAllFoodItemsData,
    );
  });

  test("fail reject food item pending, food item pending not found", async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result: useRejectFoodItemPendingResult } = renderHook(
      () => useRejectFoodItemPending(),
      { wrapper },
    );

    try {
      await act(async () => {
        const mutationPromise =
          useRejectFoodItemPendingResult.current.mutateAsync({
            food_item_pending_id: "5",
          });

        await mutationPromise;
      });

      await waitFor(() =>
        expect(useRejectFoodItemPendingResult.current.isSuccess).toBe(true),
      );
    } catch (err: any) {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toEqual(
        "Failed to reject food item pending, food item pending not found",
      );
    }

    expect(sendSocketGroupMessageMock).not.toHaveBeenCalled();
  });
});

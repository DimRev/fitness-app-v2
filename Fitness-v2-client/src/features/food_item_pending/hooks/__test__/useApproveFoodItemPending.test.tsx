import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import useApproveFoodItemPending from "../useApproveFoodItemPending";
import { QUERY_KEYS } from "~/lib/reactQuery";

const sendSocketGroupMessageMock = vi.fn();

vi.mock("~/features/socket/hooks/useSocket", () => {
  return {
    default: () => ({
      sendSocketGroupMessage: sendSocketGroupMessageMock,
    }),
  };
});

describe("useApproveFoodItemPending", () => {
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

  test("successful approve food item pending", async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result: useApproveFoodItemPendingResult } = renderHook(
      () => useApproveFoodItemPending(),
      { wrapper },
    );

    try {
      await act(async () => {
        const mutationPromise =
          useApproveFoodItemPendingResult.current.mutateAsync({
            food_item_pending_id: "1",
          });

        await mutationPromise;
      });

      await waitFor(() =>
        expect(useApproveFoodItemPendingResult.current.isSuccess).toBe(true),
      );

      expect(useApproveFoodItemPendingResult.current.data).toEqual({
        message: "Food item pending approved",
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

  test("fail approve food item pending, food item pending not found", async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result: useApproveFoodItemPendingResult } = renderHook(
      () => useApproveFoodItemPending(),
      { wrapper },
    );

    try {
      await act(async () => {
        const mutationPromise =
          useApproveFoodItemPendingResult.current.mutateAsync({
            food_item_pending_id: "5",
          });

        // Wait for the mutation to start
        setTimeout(() => {
          expect(useApproveFoodItemPendingResult.current.isLoading).toBe(true);
        }, 300);

        await mutationPromise;
      });

      await waitFor(() =>
        expect(useApproveFoodItemPendingResult.current.isSuccess).toBe(true),
      );
    } catch (err: any) {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toEqual(
        "Failed to approve food item pending, food item pending not found",
      );
    }

    expect(sendSocketGroupMessageMock).not.toHaveBeenCalled();
  });
});

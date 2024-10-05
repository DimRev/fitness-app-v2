import { QueryClient, QueryClientProvider } from "react-query";
import useToggleFoodItemPending from "../useToggleFoodItemPending";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QUERY_KEYS } from "~/lib/reactQuery";

const sendSocketGroupMessageMock = vi.fn();

vi.mock("~/features/socket/hooks/useSocket", () => {
  return {
    default: () => ({
      sendSocketGroupMessage: sendSocketGroupMessageMock,
    }),
  };
});

describe("useToggleFoodItemPending", () => {
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

  test("successful toggle food item pending, liked", async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result: useToggleFoodItemPendingResult } = renderHook(
      () => useToggleFoodItemPending(),
      { wrapper },
    );

    try {
      await act(async () => {
        const mutationPromise =
          useToggleFoodItemPendingResult.current.mutateAsync({
            food_item_pending_id: "3",
            limit: 10,
            offset: 0,
            text_filter: "",
          });

        await mutationPromise;
      });

      await waitFor(() =>
        expect(useToggleFoodItemPendingResult.current.isSuccess).toBe(true),
      );

      expect(useToggleFoodItemPendingResult.current.data).toEqual({
        message: "Food item pending liked",
      });

      const invalidateAllFoodItemsPendingData: BroadcastData = {
        group: [QUERY_KEYS.FOOD_ITEMS_PENDING.GET_FOOD_ITEMS_PENDING],
        action: "invalidate",
        data: {
          limit: 10,
          offset: 0,
          text_filter: "",
        },
      };
      expect(sendSocketGroupMessageMock).toHaveBeenCalledWith(
        QUERY_KEYS.FOOD_ITEMS_PENDING.GET_FOOD_ITEMS_PENDING,
        invalidateAllFoodItemsPendingData,
      );
    } catch (err) {}
  });

  test("successful toggle food item pending, unliked", async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result: useToggleFoodItemPendingResult } = renderHook(
      () => useToggleFoodItemPending(),
      { wrapper },
    );

    try {
      await act(async () => {
        const mutationPromise =
          useToggleFoodItemPendingResult.current.mutateAsync({
            food_item_pending_id: "1",
            limit: 10,
            offset: 0,
            text_filter: "",
          });

        await mutationPromise;
      });

      await waitFor(() =>
        expect(useToggleFoodItemPendingResult.current.isSuccess).toBe(true),
      );

      expect(useToggleFoodItemPendingResult.current.data).toEqual({
        message: "Food item pending unliked",
      });

      const invalidateAllFoodItemsPendingData: BroadcastData = {
        group: [QUERY_KEYS.FOOD_ITEMS_PENDING.GET_FOOD_ITEMS_PENDING],
        action: "invalidate",
        data: {
          limit: 10,
          offset: 0,
          text_filter: "",
        },
      };
      expect(sendSocketGroupMessageMock).toHaveBeenCalledWith(
        QUERY_KEYS.FOOD_ITEMS_PENDING.GET_FOOD_ITEMS_PENDING,
        invalidateAllFoodItemsPendingData,
      );
    } catch (err) {}
  });
});

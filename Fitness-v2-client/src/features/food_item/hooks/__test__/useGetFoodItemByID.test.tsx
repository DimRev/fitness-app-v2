import { renderHook, waitFor } from "@testing-library/react";
import useGetFoodItemsByID from "../useGetFoodItemByID";
import { QueryClient, QueryClientProvider } from "react-query";
import { QUERY_KEYS } from "~/lib/reactQuery";

// Mock the useSocket hook
const joinSocketGroupMock = vi.fn();
const leaveSocketGroupMock = vi.fn();

vi.mock("~/features/socket/hooks/useSocket", () => {
  return {
    default: () => ({
      joinSocketGroup: joinSocketGroupMock,
      leaveSocketGroup: leaveSocketGroupMock,
    }),
  };
});

describe("useGetFoodItemByID", () => {
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
    joinSocketGroupMock.mockClear();
    leaveSocketGroupMock.mockClear();
  });

  test("successful get food item by id", async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const {
      result: useGetFoodItemByIDResult,
      unmount: useGetFoodItemByIDUnmount,
    } = renderHook(
      () =>
        useGetFoodItemsByID({
          food_item_id: "1",
        }),
      { wrapper },
    );

    expect(useGetFoodItemByIDResult.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(useGetFoodItemByIDResult.current.isSuccess).toBe(true);
    });

    expect(useGetFoodItemByIDResult.current.data).toEqual({
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

    expect(joinSocketGroupMock).toHaveBeenCalledWith(
      QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS_BY_ID,
    );
    useGetFoodItemByIDUnmount();
    expect(leaveSocketGroupMock).toHaveBeenCalledWith(
      QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS_BY_ID,
    );
  });

  test("fail to get food item by id, not found", async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const {
      result: useGetFoodItemByIDResult,
      unmount: useGetFoodItemByIDUnmount,
    } = renderHook(
      () =>
        useGetFoodItemsByID({
          food_item_id: "5",
        }),
      { wrapper },
    );

    expect(useGetFoodItemByIDResult.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(useGetFoodItemByIDResult.current.isError).toBe(true);
    });

    expect(useGetFoodItemByIDResult.current.error).toEqual(
      new Error("Failed fetch food item, food item not found"),
    );

    expect(joinSocketGroupMock).toHaveBeenCalledWith(
      QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS_BY_ID,
    );
    useGetFoodItemByIDUnmount();
    expect(leaveSocketGroupMock).toHaveBeenCalledWith(
      QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS_BY_ID,
    );
  });
});

import { QueryClient, QueryClientProvider } from "react-query";
import useGetFoodItems from "../useGetFoodItems";
import { renderHook, waitFor } from "@testing-library/react";
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

describe("useGetFoodItems", () => {
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

  test("successful get food items", async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result: useGetFoodItemsResult, unmount: useGetFoodItemsUnmount } =
      renderHook(
        () =>
          useGetFoodItems({
            limit: 10,
            offset: 0,
            text_filter: "",
          }),
        { wrapper },
      );

    expect(useGetFoodItemsResult.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(useGetFoodItemsResult.current.isSuccess).toBe(true);
    });

    expect(useGetFoodItemsResult.current.data).toEqual({
      food_items: [
        {
          id: "1",
          name: "test food item 1",
          calories: "1000",
          carbs: "1000",
          fat: "1000",
          protein: "1000",
          food_type: "protein",
          description: "test description 1",
          image_url: undefined,
        },
        {
          id: "2",
          name: "test food item 2",
          calories: "2000",
          carbs: "2000",
          fat: "2000",
          protein: "2000",
          food_type: "protein",
          description: "test description 2",
          image_url: undefined,
        },
        {
          id: "3",
          name: "test food item 3",
          calories: "3000",
          carbs: "3000",
          fat: "3000",
          protein: "3000",
          food_type: "protein",
          description: "test description 3",
          image_url: undefined,
        },
        {
          id: "4",
          name: "test food item 4",
          calories: "4000",
          carbs: "4000",
          fat: "4000",
          protein: "4000",
          food_type: "protein",
          description: "test description 4",
          image_url: undefined,
        },
      ],
      total_pages: 1,
      total_items: 4,
    });

    expect(joinSocketGroupMock).toHaveBeenCalledWith(
      QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS,
    );
    useGetFoodItemsUnmount();
    expect(leaveSocketGroupMock).toHaveBeenCalledWith(
      QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS,
    );
  });

  test("successful get empty food items, limit 0", async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result: useGetFoodItemsResult, unmount: useGetFoodItemsUnmount } =
      renderHook(
        () =>
          useGetFoodItems({
            limit: 0,
            offset: 0,
            text_filter: "",
          }),
        { wrapper },
      );

    expect(useGetFoodItemsResult.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(useGetFoodItemsResult.current.isSuccess).toBe(true);
    });

    expect(useGetFoodItemsResult.current.data).toEqual({
      food_items: [],
      total_pages: 1,
      total_items: 0,
    });

    expect(joinSocketGroupMock).toHaveBeenCalledWith(
      QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS,
    );
    useGetFoodItemsUnmount();
    expect(leaveSocketGroupMock).toHaveBeenCalledWith(
      QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS,
    );
  });

  test("successful get empty food items, text filter non-existent", async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result: useGetFoodItemsResult, unmount: useGetFoodItemsUnmount } =
      renderHook(
        () =>
          useGetFoodItems({
            limit: 10,
            offset: 0,
            text_filter: "non-existent",
          }),
        { wrapper },
      );

    expect(useGetFoodItemsResult.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(useGetFoodItemsResult.current.isSuccess).toBe(true);
    });

    expect(useGetFoodItemsResult.current.data).toEqual({
      food_items: [],
      total_pages: 1,
      total_items: 0,
    });

    expect(joinSocketGroupMock).toHaveBeenCalledWith(
      QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS,
    );
    useGetFoodItemsUnmount();
    expect(leaveSocketGroupMock).toHaveBeenCalledWith(
      QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS,
    );
  });

  test("successful get single item, text filter existent", async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result: useGetFoodItemsResult, unmount: useGetFoodItemsUnmount } =
      renderHook(
        () =>
          useGetFoodItems({
            limit: 10,
            offset: 0,
            text_filter: "test food item 1",
          }),
        { wrapper },
      );

    expect(useGetFoodItemsResult.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(useGetFoodItemsResult.current.isSuccess).toBe(true);
    });

    expect(useGetFoodItemsResult.current.data).toEqual({
      food_items: [
        {
          id: "1",
          name: "test food item 1",
          calories: "1000",
          carbs: "1000",
          fat: "1000",
          protein: "1000",
          food_type: "protein",
          description: "test description 1",
          image_url: undefined,
        },
      ],
      total_pages: 1,
      total_items: 1,
    });

    expect(joinSocketGroupMock).toHaveBeenCalledWith(
      QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS,
    );
    useGetFoodItemsUnmount();
    expect(leaveSocketGroupMock).toHaveBeenCalledWith(
      QUERY_KEYS.FOOD_ITEMS.GET_FOOD_ITEMS,
    );
  });
});

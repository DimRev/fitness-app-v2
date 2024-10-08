import { QueryClient, QueryClientProvider } from "react-query";
import useGetFoodItemsPending from "../useGetFoodItemsPending";
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

describe("useGetFoodItemsPending", () => {
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

  test("successful get food items pending", async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const {
      result: useGetFoodItemsPendingResult,
      unmount: useGetFoodItemsPendingUnmount,
    } = renderHook(
      () =>
        useGetFoodItemsPending({
          limit: 10,
          offset: 0,
          text_filter: "",
        }),
      { wrapper },
    );

    expect(useGetFoodItemsPendingResult.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(useGetFoodItemsPendingResult.current.isSuccess).toBe(true);
    });

    expect(useGetFoodItemsPendingResult.current.data).toEqual({
      food_items_pending: [
        {
          id: "1",
          name: "test food item pending 1",
          description: "test description 1",
          image_url: undefined,
          food_type: "protein",
          calories: "1000",
          fat: "1000",
          protein: "1000",
          carbs: "1000",
          likes: 1,
          liked: true,
          author_name: "one",
        },
        {
          id: "2",
          name: "test food item pending 2",
          description: "test description 2",
          image_url: undefined,
          food_type: "protein",
          calories: "2000",
          fat: "2000",
          protein: "2000",
          carbs: "2000",
          likes: 2,
          liked: true,
          author_name: "two",
        },
        {
          id: "3",
          name: "test food item pending 3",
          description: "test description 3",
          image_url: undefined,
          food_type: "protein",
          calories: "3000",
          fat: "3000",
          protein: "3000",
          carbs: "3000",
          likes: 3,
          liked: false,
          author_name: "three",
        },
        {
          id: "4",
          name: "test food item pending 4",
          description: "test description 4",
          image_url: undefined,
          food_type: "protein",
          calories: "4000",
          fat: "4000",
          protein: "4000",
          carbs: "4000",
          likes: 4,
          liked: false,
          author_name: "four",
        },
      ],
      total_pages: 1,
    });

    expect(joinSocketGroupMock).toHaveBeenCalledWith(
      QUERY_KEYS.FOOD_ITEMS_PENDING.GET_FOOD_ITEMS_PENDING,
    );
    useGetFoodItemsPendingUnmount();
    expect(leaveSocketGroupMock).toHaveBeenCalledWith(
      QUERY_KEYS.FOOD_ITEMS_PENDING.GET_FOOD_ITEMS_PENDING,
    );
  });

  test("successful get empty food items pending, limit 0", async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const {
      result: useGetFoodItemsPendingResult,
      unmount: useGetFoodItemsPendingUnmount,
    } = renderHook(
      () =>
        useGetFoodItemsPending({
          limit: 0,
          offset: 0,
          text_filter: "",
        }),
      { wrapper },
    );

    expect(useGetFoodItemsPendingResult.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(useGetFoodItemsPendingResult.current.isSuccess).toBe(true);
    });

    expect(useGetFoodItemsPendingResult.current.data).toEqual({
      food_items_pending: [],
      total_pages: 1,
    });

    expect(joinSocketGroupMock).toHaveBeenCalledWith(
      QUERY_KEYS.FOOD_ITEMS_PENDING.GET_FOOD_ITEMS_PENDING,
    );
    useGetFoodItemsPendingUnmount();
    expect(leaveSocketGroupMock).toHaveBeenCalledWith(
      QUERY_KEYS.FOOD_ITEMS_PENDING.GET_FOOD_ITEMS_PENDING,
    );
  });

  test("successful get empty food items pending, text filter non-existent", async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const {
      result: useGetFoodItemsPendingResult,
      unmount: useGetFoodItemsPendingUnmount,
    } = renderHook(
      () =>
        useGetFoodItemsPending({
          limit: 10,
          offset: 0,
          text_filter: "non-existent",
        }),
      { wrapper },
    );

    expect(useGetFoodItemsPendingResult.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(useGetFoodItemsPendingResult.current.isSuccess).toBe(true);
    });

    expect(useGetFoodItemsPendingResult.current.data).toEqual({
      food_items_pending: [],
      total_pages: 1,
    });

    expect(joinSocketGroupMock).toHaveBeenCalledWith(
      QUERY_KEYS.FOOD_ITEMS_PENDING.GET_FOOD_ITEMS_PENDING,
    );
    useGetFoodItemsPendingUnmount();
    expect(leaveSocketGroupMock).toHaveBeenCalledWith(
      QUERY_KEYS.FOOD_ITEMS_PENDING.GET_FOOD_ITEMS_PENDING,
    );
  });

  test("successful get single food item pending, text filter existent, single food item", async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const {
      result: useGetFoodItemsPendingResult,
      unmount: useGetFoodItemsPendingUnmount,
    } = renderHook(
      () =>
        useGetFoodItemsPending({
          limit: 10,
          offset: 0,
          text_filter: "test food item pending 1",
        }),
      { wrapper },
    );

    expect(useGetFoodItemsPendingResult.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(useGetFoodItemsPendingResult.current.isSuccess).toBe(true);
    });

    expect(useGetFoodItemsPendingResult.current.data).toEqual({
      food_items_pending: [
        {
          id: "1",
          name: "test food item pending 1",
          description: "test description 1",
          image_url: undefined,
          food_type: "protein",
          calories: "1000",
          fat: "1000",
          protein: "1000",
          carbs: "1000",
          likes: 1,
          liked: true,
          author_name: "one",
        },
      ],
      total_pages: 1,
    });

    expect(joinSocketGroupMock).toHaveBeenCalledWith(
      QUERY_KEYS.FOOD_ITEMS_PENDING.GET_FOOD_ITEMS_PENDING,
    );
    useGetFoodItemsPendingUnmount();
    expect(leaveSocketGroupMock).toHaveBeenCalledWith(
      QUERY_KEYS.FOOD_ITEMS_PENDING.GET_FOOD_ITEMS_PENDING,
    );
  });
});

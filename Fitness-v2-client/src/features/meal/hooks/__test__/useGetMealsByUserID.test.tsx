import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import useGetMealsByUserID from "../useGetMealsByUserID";
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

describe("useGetMealByUserID", () => {
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

  test("successfully get meals", async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const {
      result: useGetMealsByUserIDResult,
      unmount: useGetMealsByUserIDUnmount,
    } = renderHook(
      () =>
        useGetMealsByUserID({
          limit: 10,
          offset: 0,
          text_filter: "",
        }),
      { wrapper },
    );

    expect(useGetMealsByUserIDResult.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(useGetMealsByUserIDResult.current.isSuccess).toBe(true);
    });

    expect(useGetMealsByUserIDResult.current.data).toEqual({
      meals: [
        {
          meal: {
            id: "1",
            name: "test meal 1",
            description: "test description 1",
            image_url: undefined,
            created_at: "2024-01-01T00:00:00.000Z",
            updated_at: "2024-01-01T00:00:00.000Z",
          },
          total_calories: 1000,
          total_fat: 1000,
          total_protein: 1000,
          total_carbs: 1000,
        },
        {
          meal: {
            id: "2",
            name: "test meal 2",
            description: "test description 2",
            image_url: undefined,
            created_at: "2024-01-02T00:00:00.000Z",
            updated_at: "2024-01-02T00:00:00.000Z",
          },
          total_calories: 2000,
          total_fat: 2000,
          total_protein: 2000,
          total_carbs: 2000,
        },
        {
          meal: {
            id: "3",
            name: "test meal 3",
            description: "test description 3",
            image_url: undefined,
            created_at: "2024-01-03T00:00:00.000Z",
            updated_at: "2024-01-03T00:00:00.000Z",
          },
          total_calories: 3000,
          total_fat: 3000,
          total_protein: 3000,
          total_carbs: 3000,
        },
        {
          meal: {
            id: "4",
            name: "test meal 4",
            description: "test description 4",
            image_url: undefined,
            created_at: "2024-01-04T00:00:00.000Z",
            updated_at: "2024-01-04T00:00:00.000Z",
          },
          total_calories: 4000,
          total_fat: 4000,
          total_protein: 4000,
          total_carbs: 4000,
        },
      ],
      total_pages: 1,
    });

    expect(joinSocketGroupMock).toHaveBeenCalledWith(
      QUERY_KEYS.MEALS.GET_MEALS_BY_USER_ID,
    );

    useGetMealsByUserIDUnmount();
    expect(leaveSocketGroupMock).toHaveBeenCalledWith(
      QUERY_KEYS.MEALS.GET_MEALS_BY_USER_ID,
    );
  });

  test("successful get meals, text filter existent", async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const {
      result: useGetMealsByUserIDResult,
      unmount: useGetMealsByUserIDUnmount,
    } = renderHook(
      () =>
        useGetMealsByUserID({
          limit: 10,
          offset: 0,
          text_filter: "test meal 1",
        }),
      { wrapper },
    );

    expect(useGetMealsByUserIDResult.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(useGetMealsByUserIDResult.current.isSuccess).toBe(true);
    });

    expect(useGetMealsByUserIDResult.current.data).toEqual({
      meals: [
        {
          meal: {
            id: "1",
            name: "test meal 1",
            description: "test description 1",
            image_url: undefined,
            created_at: "2024-01-01T00:00:00.000Z",
            updated_at: "2024-01-01T00:00:00.000Z",
          },
          total_calories: 1000,
          total_fat: 1000,
          total_protein: 1000,
          total_carbs: 1000,
        },
      ],
      total_pages: 1,
    });

    expect(joinSocketGroupMock).toHaveBeenCalledWith(
      QUERY_KEYS.MEALS.GET_MEALS_BY_USER_ID,
    );
    useGetMealsByUserIDUnmount();
    expect(leaveSocketGroupMock).toHaveBeenCalledWith(
      QUERY_KEYS.MEALS.GET_MEALS_BY_USER_ID,
    );
  });

  test("successful get meals, text filter non-existent", async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const {
      result: useGetMealsByUserIDResult,
      unmount: useGetMealsByUserIDUnmount,
    } = renderHook(
      () =>
        useGetMealsByUserID({
          limit: 10,
          offset: 0,
          text_filter: "non-existent",
        }),
      { wrapper },
    );

    expect(useGetMealsByUserIDResult.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(useGetMealsByUserIDResult.current.isSuccess).toBe(true);
    });

    expect(useGetMealsByUserIDResult.current.data).toEqual({
      meals: [],
      total_pages: 1,
    });

    expect(joinSocketGroupMock).toHaveBeenCalledWith(
      QUERY_KEYS.MEALS.GET_MEALS_BY_USER_ID,
    );
    useGetMealsByUserIDUnmount();
    expect(leaveSocketGroupMock).toHaveBeenCalledWith(
      QUERY_KEYS.MEALS.GET_MEALS_BY_USER_ID,
    );
  });

  test("successful get meals, limit 0", async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const {
      result: useGetMealsByUserIDResult,
      unmount: useGetMealsByUserIDUnmount,
    } = renderHook(
      () =>
        useGetMealsByUserID({
          limit: 0,
          offset: 0,
          text_filter: "",
        }),
      { wrapper },
    );

    expect(useGetMealsByUserIDResult.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(useGetMealsByUserIDResult.current.isSuccess).toBe(true);
    });

    expect(useGetMealsByUserIDResult.current.data).toEqual({
      meals: [],
      total_pages: 1,
    });

    expect(joinSocketGroupMock).toHaveBeenCalledWith(
      QUERY_KEYS.MEALS.GET_MEALS_BY_USER_ID,
    );
    useGetMealsByUserIDUnmount();
    expect(leaveSocketGroupMock).toHaveBeenCalledWith(
      QUERY_KEYS.MEALS.GET_MEALS_BY_USER_ID,
    );
  });
});

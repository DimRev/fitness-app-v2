import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import useGetMealByID from "../useGetMealByID";
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

describe("useGetMealByID", () => {
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

  test("successful get meal", async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result: useGetMealByIDResult, unmount: useGetMealByIDUnmount } =
      renderHook(
        () =>
          useGetMealByID({
            mealId: "1",
          }),
        { wrapper },
      );

    expect(useGetMealByIDResult.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(useGetMealByIDResult.current.isSuccess).toBe(true);
    });

    expect(useGetMealByIDResult.current.data).toEqual({
      meal: {
        meal: {
          id: "1",
          name: "test meal 1",
          description: "test description 1",
          created_at: "2024-01-01T00:00:00.000Z",
          updated_at: "2024-01-01T00:00:00.000Z",
        },
        total_calories: 1000,
        total_fat: 1000,
        total_protein: 1000,
        total_carbs: 1000,
      },
      food_items: [
        {
          amount: 1,
          food_item: {
            id: "1",
            name: "test food item 1",
            description: "test description 1",
            image_url: undefined,
            food_type: "protein",
            calories: "1000",
            fat: "1000",
            protein: "1000",
            carbs: "1000",
          },
        },
      ],
    });

    expect(joinSocketGroupMock).toHaveBeenCalledWith(
      QUERY_KEYS.MEALS.GET_MEAL_BY_ID,
    );

    useGetMealByIDUnmount();
    expect(leaveSocketGroupMock).toHaveBeenCalledWith(
      QUERY_KEYS.MEALS.GET_MEAL_BY_ID,
    );
  });

  test("failed to get meal, wrong meal id", async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result: useGetMealByIDResult, unmount: useGetMealByIDUnmount } =
      renderHook(
        () =>
          useGetMealByID({
            mealId: "5",
          }),
        { wrapper },
      );

    expect(useGetMealByIDResult.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(useGetMealByIDResult.current.isError).toBe(true);
    });

    expect(useGetMealByIDResult.current.error).toEqual(
      new Error("Failed to get meal, meal not found"),
    );

    expect(joinSocketGroupMock).toHaveBeenCalledWith(
      QUERY_KEYS.MEALS.GET_MEAL_BY_ID,
    );

    useGetMealByIDUnmount();
    expect(leaveSocketGroupMock).toHaveBeenCalledWith(
      QUERY_KEYS.MEALS.GET_MEAL_BY_ID,
    );
  });
});

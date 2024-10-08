import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import useGetChartDataMealsConsumed from "../useGetChartDataMealsConsumed";
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

describe("useGetChartDataMealsConsumed", () => {
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

  test("successful get chart data meals consumed", async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const {
      result: useGetChartDataMealsConsumedResult,
      unmount: useGetChartDataMealsConsumedUnmount,
    } = renderHook(() => useGetChartDataMealsConsumed(), { wrapper });

    expect(useGetChartDataMealsConsumedResult.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(useGetChartDataMealsConsumedResult.current.isSuccess).toBe(true);
    });

    expect(useGetChartDataMealsConsumedResult.current.data).toEqual([
      {
        date: "2024-01-01T00:00:00.000Z",
        total_calories: 1000,
        total_protein: 1000,
        total_carbs: 1000,
        total_fat: 1000,
      },
      {
        date: "2024-01-02T00:00:00.000Z",
        total_calories: 2000,
        total_protein: 2000,
        total_carbs: 2000,
        total_fat: 2000,
      },
      {
        date: "2024-01-03T00:00:00.000Z",
        total_calories: 3000,
        total_protein: 3000,
        total_carbs: 3000,
        total_fat: 3000,
      },
    ]);

    expect(joinSocketGroupMock).toHaveBeenCalledWith(
      QUERY_KEYS.CHART_DATA.GET_CHART_DATA_MEALS_CONSUMED,
    );
    useGetChartDataMealsConsumedUnmount();
    expect(leaveSocketGroupMock).toHaveBeenCalledWith(
      QUERY_KEYS.CHART_DATA.GET_CHART_DATA_MEALS_CONSUMED,
    );
  });
});

import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import useGetChartDataMeasurements from "../useGetChartDataMeasurements";
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

describe("useGetChartDataMeasurements", () => {
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
      result: useGetChartDataMeasurementsResult,
      unmount: useGetChartDataMeasurementsUnmount,
    } = renderHook(() => useGetChartDataMeasurements(), { wrapper });

    expect(useGetChartDataMeasurementsResult.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(useGetChartDataMeasurementsResult.current.isSuccess).toBe(true);
    });

    expect(useGetChartDataMeasurementsResult.current.data).toEqual([
      {
        date: "2024-01-01T00:00:00.000Z",
        bmi: 23.5,
        height: 170,
        weight: 80,
      },
      {
        date: "2024-01-02T00:00:00.000Z",
        bmi: 22.5,
        height: 170,
        weight: 70,
      },
      {
        date: "2024-01-03T00:00:00.000Z",
        bmi: 20.5,
        height: 170,
        weight: 60,
      },
    ]);

    expect(joinSocketGroupMock).toHaveBeenCalledWith(
      QUERY_KEYS.CHART_DATA.GET_CHART_DATA_MEASUREMENTS,
    );
    useGetChartDataMeasurementsUnmount();
    expect(leaveSocketGroupMock).toHaveBeenCalledWith(
      QUERY_KEYS.CHART_DATA.GET_CHART_DATA_MEASUREMENTS,
    );
  });
});

import { QueryClient, QueryClientProvider } from "react-query";
import useGetCheckTodayMeasurement from "../useGetCheckTodayMeasurement";
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

describe("useGetMeasurementsByUserID", () => {
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

  test("successfully get check today measurement", async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const {
      result: useGetCheckTodayMeasurementResult,
      unmount: useGetCheckTodayMeasurementUnmount,
    } = renderHook(() => useGetCheckTodayMeasurement(), { wrapper });

    expect(useGetCheckTodayMeasurementResult.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(useGetCheckTodayMeasurementResult.current.isSuccess).toBe(true);
    });

    const currDate = new Date().toISOString().split("T")[0] + "T00:00:00.000Z";

    expect(useGetCheckTodayMeasurementResult.current.data).toEqual({
      isMeasuredToday: true,
      measurement: {
        bmi: 1234,
        height: 1000,
        weight: 1000,
        date: currDate,
      },
    });

    expect(joinSocketGroupMock).toHaveBeenCalledWith(
      QUERY_KEYS.MEASUREMENT.GET_CHECK_TODAY_MEASUREMENT,
    );

    useGetCheckTodayMeasurementUnmount();
    expect(leaveSocketGroupMock).toHaveBeenCalledWith(
      QUERY_KEYS.MEASUREMENT.GET_CHECK_TODAY_MEASUREMENT,
    );
  });
});

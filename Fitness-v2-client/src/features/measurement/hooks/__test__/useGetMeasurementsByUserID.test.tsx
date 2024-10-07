import { QueryClient, QueryClientProvider } from "react-query";
import useGetMeasurementsByUserID from "../useGetMeasurementsByUserID";
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

  test("successfully get measurements", async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const {
      result: useGetMeasurementsByUserIDResult,
      unmount: useGetMeasurementsByUserIDUnmount,
    } = renderHook(() => useGetMeasurementsByUserID(), { wrapper });

    expect(useGetMeasurementsByUserIDResult.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(useGetMeasurementsByUserIDResult.current.isSuccess).toBe(true);
    });

    expect(useGetMeasurementsByUserIDResult.current.data).toEqual([
      {
        bmi: 1000,
        height: 1000,
        weight: 1000,
        date: "2024-01-01T00:00:00.000Z",
      },
      {
        bmi: 2000,
        height: 2000,
        weight: 2000,
        date: "2024-01-02T00:00:00.000Z",
      },
      {
        bmi: 3000,
        height: 3000,
        weight: 3000,
        date: "2024-01-03T00:00:00.000Z",
      },
      {
        bmi: 4000,
        height: 4000,
        weight: 4000,
        date: "2024-01-04T00:00:00.000Z",
      },
      {
        bmi: 5000,
        height: 5000,
        weight: 5000,
        date: "2024-01-05T00:00:00.000Z",
      },
      {
        bmi: 6000,
        height: 6000,
        weight: 6000,
        date: "2024-01-06T00:00:00.000Z",
      },
    ]);

    expect(joinSocketGroupMock).toHaveBeenCalledWith(
      QUERY_KEYS.MEASUREMENT.GET_MEASUREMENTS_BY_USER_ID,
    );
    useGetMeasurementsByUserIDUnmount();
    expect(leaveSocketGroupMock).toHaveBeenCalledWith(
      QUERY_KEYS.MEASUREMENT.GET_MEASUREMENTS_BY_USER_ID,
    );
  });
});

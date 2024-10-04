import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { QUERY_KEYS } from "~/lib/reactQuery";
import useGetCalendarDataByDate from "../useGetCalendarDataByDate";

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

describe("useGetCalendarDataByDate", () => {
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

  test("successful get calendar data by date", async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const {
      result: useGetCalendarDataByDateResult,
      unmount: useGetCalendarDataByDateUnmount,
    } = renderHook(
      () => useGetCalendarDataByDate({ date: new Date("2024-01-01") }),
      { wrapper },
    );

    expect(useGetCalendarDataByDateResult.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(useGetCalendarDataByDateResult.current.isSuccess).toBe(true);
    });

    expect(useGetCalendarDataByDateResult.current.data).toEqual({
      meals: [
        { meal_id: "1", name: "test meal 1" },
        { meal_id: "2", name: "test meal 2" },
        { meal_id: "3", name: "test meal 3" },
      ],
      total_calories: 1000,
      total_protein: 1000,
      total_carbs: 1000,
      total_fat: 1000,
    });

    expect(joinSocketGroupMock).toHaveBeenCalledWith(
      QUERY_KEYS.CALENDAR_DATA.GET_CALENDAR_DATA_BY_DATE,
    );
    useGetCalendarDataByDateUnmount();
    expect(leaveSocketGroupMock).toHaveBeenCalledWith(
      QUERY_KEYS.CALENDAR_DATA.GET_CALENDAR_DATA_BY_DATE,
    );
  });
});

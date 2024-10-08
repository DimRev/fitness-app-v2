import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import useCreateMeasurement from "../useCreateMeasurement";

const sendSocketGroupMessageMock = vi.fn();

vi.mock("~/features/socket/hooks/useSocket", () => {
  return {
    default: () => ({
      sendSocketGroupMessage: sendSocketGroupMessageMock,
    }),
  };
});

describe("useCreateMeasurement", () => {
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
    sendSocketGroupMessageMock.mockClear();
  });

  test("successful create measurement", async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result: useCreateMeasurementResult } = renderHook(
      () => useCreateMeasurement(),
      {
        wrapper,
      },
    );

    try {
      void useCreateMeasurementResult.current.mutate({
        weight: "1000",
        height: "1000",
      });

      waitFor(() =>
        expect(useCreateMeasurementResult.current.isSuccess).toBe(true),
      );

      const currDate =
        new Date().toISOString().split("T")[0] + "T00:00:00.000Z";

      expect(useCreateMeasurementResult.current.data).toEqual({
        bmi: 2000,
        height: 1000,
        weight: 1000,
        date: currDate,
      });

      expect(sendSocketGroupMessageMock).not.toHaveBeenCalled();
    } catch (err) {}
  });
});

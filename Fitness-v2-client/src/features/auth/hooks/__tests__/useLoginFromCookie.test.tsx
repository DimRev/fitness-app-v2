import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import useLoginFromCookie from "../useLoginFromCookie";

// Mock the useSocket hook
const signInSocketMock = vi.fn();

vi.mock("~/features/socket/hooks/useSocket", () => {
  return {
    default: () => ({
      signInSocket: signInSocketMock,
    }),
  };
});

describe("useLoginFromCookie", () => {
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
    signInSocketMock.mockClear();
  });

  test("successful login from cookie", async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useLoginFromCookie(), { wrapper });
    document.cookie = "jwt=test";

    try {
      act(() => {
        result.current.mutate();
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual({
        email: "test@test.com",
        username: "test",
        image_url: null,
        role: "user",
        session_token: "test",
      });

      document.cookie = "";

      expect(signInSocketMock).toHaveBeenCalledWith("test@test.com");
    } catch (err) {}
  });

  test("failed login from cookie", async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useLoginFromCookie(), { wrapper });

    try {
      act(() => {
        result.current.mutate();
      });

      document.cookie = "jwt=wrongCookie";

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe("missing or invalid jwt");
    } catch (err: any) {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe("missing or invalid jwt");
      expect(signInSocketMock).not.toHaveBeenCalled();
    }
  });
});

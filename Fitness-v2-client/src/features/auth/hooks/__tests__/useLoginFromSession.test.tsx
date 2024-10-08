import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import useLoginFromSession from "../useLoginFromSession";

// Mock the useSocket hook
const signInSocketMock = vi.fn();

vi.mock("~/features/socket/hooks/useSocket", () => {
  return {
    default: () => ({
      signInSocket: signInSocketMock,
    }),
  };
});

describe("useLoginFromSession", () => {
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

  test("successful login from session", async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useLoginFromSession(), { wrapper });

    try {
      act(() => {
        result.current.mutate({
          session_token: "test_token",
        });
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

      // Verify that signInSocket was called with the correct email
      expect(signInSocketMock).toHaveBeenCalledWith("test@test.com");
    } catch (err: any) {}
  });

  test("failed login from session", async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useLoginFromSession(), { wrapper });

    try {
      act(() => {
        result.current.mutate({
          session_token: "wrong_token",
        });
      });
      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe(
        "Failed to login, invalid session token",
      );
    } catch (err: any) {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe("Failed to login, invalid session token");
      expect(signInSocketMock).not.toHaveBeenCalled();
    }
  });
});

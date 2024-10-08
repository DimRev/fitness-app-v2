import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { vi } from "vitest";
import useLogin from "../useLogin";

// Mock the useSocket hook
const signInSocketMock = vi.fn();

vi.mock("~/features/socket/hooks/useSocket", () => {
  return {
    default: () => ({
      signInSocket: signInSocketMock,
    }),
  };
});

describe("useLogin", () => {
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

  test("successful login", async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useLogin(), { wrapper });

    try {
      act(() => {
        result.current.mutateAsync({
          email: "test@test.com",
          password: "test",
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
      expect(signInSocketMock).toHaveBeenCalledWith("test@test.com");
    } catch (err: any) {}
  });

  test("failed login", async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useLogin(), { wrapper });

    try {
      act(() => {
        result.current.mutate({
          email: "wrong@example.com",
          password: "wrongpassword",
        });
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe(
        "Failed to login, wrong email or password",
      );
    } catch (err: any) {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe("Failed to login, wrong email or password");
      expect(signInSocketMock).not.toHaveBeenCalled();
    }
  });
});

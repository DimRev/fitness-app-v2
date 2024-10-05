import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import useRegister from "../useRegister";

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

  test("successful register", async () => {
    const queryClient = createTestQueryClient();

    const { result } = renderHook(() => useRegister(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    act(() => {
      result.current.mutate({
        email: "test@test.com",
        password: "test",
        username: "test",
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
  });

  test("failed register", async () => {
    const queryClient = createTestQueryClient();

    const { result } = renderHook(() => useRegister(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    act(() => {
      result.current.mutate({
        email: "test_existing@test.com",
        password: "doesn't_matter",
        username: "doesn't_matter",
      });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe(
      "Failed to register, email already exists",
    );
  });
});

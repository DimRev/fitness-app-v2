import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import useLogin from "../useLogin";
import { vi } from "vitest";

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

    // Perform the login mutation
    act(() => {
      result.current.mutate({
        email: "test@test.com",
        password: "test",
      });
    });

    // Wait for the mutation to succeed
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Assert that the data matches the mocked response
    expect(result.current.data).toEqual({
      email: "test@test.com",
      username: "test",
      image_url: null,
      role: "user",
      session_token: "test",
    });

    // Verify that signInSocket was called with the correct email
    expect(signInSocketMock).toHaveBeenCalledWith("test@test.com");
  });

  test("failed login", async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useLogin(), { wrapper });

    // Perform the login mutation with incorrect credentials
    act(() => {
      result.current.mutate({
        email: "wrong@example.com",
        password: "wrongpassword",
      });
    });

    // Wait for the mutation to fail
    await waitFor(() => expect(result.current.isError).toBe(true));

    // Assert that the error message is correct
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe(
      "Failed to login, wrong email or password",
    );

    // Ensure signInSocket was not called
    expect(signInSocketMock).not.toHaveBeenCalled();
  });
});

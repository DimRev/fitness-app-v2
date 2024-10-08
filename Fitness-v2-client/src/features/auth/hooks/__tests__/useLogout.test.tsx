import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import useLogout from "../useLogout";

const signOutSocketMock = vi.fn();

vi.mock("~/features/socket/hooks/useSocket", () => {
  return {
    default: () => ({
      signOutSocket: signOutSocketMock,
    }),
  };
});

describe("useLogout", () => {
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
    signOutSocketMock.mockClear();
  });

  test("successful logout", async () => {
    const queryClient = createTestQueryClient();

    const { result } = renderHook(() => useLogout(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    act(() => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({
      message: "Logged out",
    });

    expect(signOutSocketMock).toHaveBeenCalled();
  });
});

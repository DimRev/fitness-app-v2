import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { useCreateSupportTicket } from "../useCreateSupportTicket";
import { act } from "react";
import { QUERY_KEYS } from "~/lib/reactQuery";

const sendSocketGroupMessageMock = vi.fn();

vi.mock("~/features/socket/hooks/useSocket", () => {
  return {
    default: () => ({
      sendSocketGroupMessage: sendSocketGroupMessageMock,
    }),
  };
});

describe("useCreateSupportTicket", () => {
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

  test("successful create support ticket", async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result: useCreateSupportTicketResult } = renderHook(
      () => useCreateSupportTicket(),
      {
        wrapper,
      },
    );

    try {
      await act(async () => {
        void useCreateSupportTicketResult.current.mutateAsync({
          description: "test description 5",
          title: "test title 5",
          support_type: "bug",
        });
      });
      expect(useCreateSupportTicketResult.current.isLoading).toBe(true);
      await waitFor(() => {
        expect(useCreateSupportTicketResult.current.isSuccess).toBe(true);
        expect(useCreateSupportTicketResult.current.isLoading).toBe(false);
      });

      expect(useCreateSupportTicketResult.current.data).toEqual({
        id: "5",
        title: "test title 5",
        description: "test description 5",
        support_type: "bug",
        created_at: "2024-01-05T00:00:00.000Z",
        author: "test_author",
        is_closed: false,
      });

      expect(sendSocketGroupMessageMock).toHaveBeenCalledWith(
        QUERY_KEYS.SUPPORT.GET_SUPPORT_TICKETS,
      );
    } catch (err) {}
  });
});

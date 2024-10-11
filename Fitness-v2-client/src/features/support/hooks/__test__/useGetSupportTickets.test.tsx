import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { useGetSupportTickets } from "../useGetSupportTickets";
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

describe("useGetSupportTickets", () => {
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

  test("successful get support tickets", async () => {
    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const {
      result: useGetSupportTicketsResult,
      unmount: useGetSupportTicketsUnmount,
    } = renderHook(
      () =>
        useGetSupportTickets({
          limit: 10,
          offset: 0,
        }),
      { wrapper },
    );

    expect(useGetSupportTicketsResult.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(useGetSupportTicketsResult.current.isSuccess).toBe(true);
    });

    expect(useGetSupportTicketsResult.current.data).toEqual({
      support_tickets: [
        {
          id: "1",
          title: "Support Ticket 1",
          description: "Description 1",
          support_type: "bug",
          created_at: "2024-01-01T00:00:00.000Z",
          author: "test_author_1",
          is_closed: false,
        },
        {
          id: "2",
          title: "Support Ticket 2",
          description: "Description 2",
          support_type: "bug",
          created_at: "2024-01-02T00:00:00.000Z",
          author: "test_author_2",
          is_closed: false,
        },
        {
          id: "3",
          title: "Support Ticket 3",
          description: "Description 3",
          support_type: "bug",
          created_at: "2024-01-03T00:00:00.000Z",
          author: "test_author_3",
          is_closed: false,
        },
        {
          id: "4",
          title: "Support Ticket 4",
          description: "Description 4",
          support_type: "bug",
          created_at: "2024-01-04T00:00:00.000Z",
          author: "test_author_4",
          is_closed: false,
        },
      ],
      total_pages: 1,
      total_items: 4,
    });

    expect(joinSocketGroupMock).toHaveBeenCalledWith(
      QUERY_KEYS.SUPPORT.GET_SUPPORT_TICKETS,
    );
    useGetSupportTicketsUnmount();
    expect(leaveSocketGroupMock).toHaveBeenCalledWith(
      QUERY_KEYS.SUPPORT.GET_SUPPORT_TICKETS,
    );
  });

  test("successfully get two pages 1/2", async () => {
    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const {
      result: useGetSupportTicketsResult,
      unmount: useGetSupportTicketsUnmount,
    } = renderHook(
      () =>
        useGetSupportTickets({
          limit: 2,
          offset: 0,
        }),
      { wrapper },
    );

    expect(useGetSupportTicketsResult.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(useGetSupportTicketsResult.current.isSuccess).toBe(true);
    });

    expect(useGetSupportTicketsResult.current.data).toEqual({
      support_tickets: [
        {
          id: "1",
          title: "Support Ticket 1",
          description: "Description 1",
          support_type: "bug",
          created_at: "2024-01-01T00:00:00.000Z",
          author: "test_author_1",
          is_closed: false,
        },
        {
          id: "2",
          title: "Support Ticket 2",
          description: "Description 2",
          support_type: "bug",
          created_at: "2024-01-02T00:00:00.000Z",
          author: "test_author_2",
          is_closed: false,
        },
      ],
      total_pages: 2,
      total_items: 4,
    });

    expect(joinSocketGroupMock).toHaveBeenCalledWith(
      QUERY_KEYS.SUPPORT.GET_SUPPORT_TICKETS,
    );
    useGetSupportTicketsUnmount();
    expect(leaveSocketGroupMock).toHaveBeenCalledWith(
      QUERY_KEYS.SUPPORT.GET_SUPPORT_TICKETS,
    );
  });

  test("successfully get two pages 2/2", async () => {
    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const {
      result: useGetSupportTicketsResult,
      unmount: useGetSupportTicketsUnmount,
    } = renderHook(
      () =>
        useGetSupportTickets({
          limit: 2,
          offset: 2,
        }),
      { wrapper },
    );

    expect(useGetSupportTicketsResult.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(useGetSupportTicketsResult.current.isSuccess).toBe(true);
    });

    expect(useGetSupportTicketsResult.current.data).toEqual({
      support_tickets: [
        {
          id: "3",
          title: "Support Ticket 3",
          description: "Description 3",
          support_type: "bug",
          created_at: "2024-01-03T00:00:00.000Z",
          author: "test_author_3",
          is_closed: false,
        },
        {
          id: "4",
          title: "Support Ticket 4",
          description: "Description 4",
          support_type: "bug",
          created_at: "2024-01-04T00:00:00.000Z",
          author: "test_author_4",
          is_closed: false,
        },
      ],
      total_pages: 2,
      total_items: 4,
    });

    expect(joinSocketGroupMock).toHaveBeenCalledWith(
      QUERY_KEYS.SUPPORT.GET_SUPPORT_TICKETS,
    );
    useGetSupportTicketsUnmount();
    expect(leaveSocketGroupMock).toHaveBeenCalledWith(
      QUERY_KEYS.SUPPORT.GET_SUPPORT_TICKETS,
    );
  });
});

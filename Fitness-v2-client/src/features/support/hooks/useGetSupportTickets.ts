import useGetQuery from "~/features/shared/hooks/useGetQuery";
import { QUERY_KEYS } from "~/lib/reactQuery";

type GetSupportTicketsParams = {
  limit: number;
  offset: number;
};

interface ErrorResponseBody extends Error {
  message: string;
}

export function useGetSupportTickets({
  limit,
  offset,
}: GetSupportTicketsParams) {
  return useGetQuery<
    GetSupportTicketsParams,
    SupportTicketsWithPages,
    ErrorResponseBody
  >(
    {
      limit: limit,
      offset: offset,
    },
    QUERY_KEYS.SUPPORT.GET_SUPPORT_TICKETS,
    "/support_tickets",
    true,
  );
}

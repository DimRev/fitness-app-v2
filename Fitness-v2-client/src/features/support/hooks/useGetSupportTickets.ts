import useGetQuery from "~/features/shared/hooks/useGetQuery";
import { QUERY_KEYS } from "~/lib/reactQuery";

type GetSupportTicketsParams = {
  limit: number;
  offset: number;
};

interface ErrorResponseBody extends Error {
  message: string;
}

export function useGetSupportTickets(params: GetSupportTicketsParams) {
  return useGetQuery<
    GetSupportTicketsParams,
    SupportTicketsWithPages,
    ErrorResponseBody
  >(params, QUERY_KEYS.SUPPORT.GET_SUPPORT_TICKETS, "/support_tickets", false);
}

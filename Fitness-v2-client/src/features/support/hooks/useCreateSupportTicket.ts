import useMutateQuery from "~/features/shared/hooks/useMutateQuery";
import { QUERY_KEYS } from "~/lib/reactQuery";
import { type SupportTicketAddFormSchema } from "../support.schema";

interface ErrorResponseBody extends Error {
  message: string;
}

export function useCreateSupportTicket() {
  return useMutateQuery<
    SupportTicketAddFormSchema,
    SupportTicket,
    ErrorResponseBody
  >(
    () => [
      {
        queryKey: QUERY_KEYS.SUPPORT.GET_SUPPORT_TICKETS,
        isBroadcast: true,
      },
    ],
    () => "/support_tickets",
    "post",
  );
}

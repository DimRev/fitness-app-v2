import { http, HttpResponse } from "msw";
import { type SupportTicketAddFormSchema } from "./support.schema";

const SUPPORT_TICKETS: SupportTicket[] = [
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
];

export const supportMockHandlers = [
  http.get("*/support_tickets", async ({ request }) => {
    const searchParams = new URL(request.url).searchParams;
    const limit = Number(searchParams.get("limit"));
    const offset = Number(searchParams.get("offset"));

    const supportTickets = SUPPORT_TICKETS.slice(offset, offset + limit);
    const totalPages = Math.ceil(SUPPORT_TICKETS.length / limit);
    const totalItems = SUPPORT_TICKETS.length;

    return HttpResponse.json<SupportTicketsWithPages>({
      support_tickets: supportTickets,
      total_pages: totalPages,
      total_items: totalItems,
    });
  }),

  http.post("*/support_tickets", async ({ request }) => {
    const requestBody = (await request.json()) as SupportTicketAddFormSchema;

    const supportTicket: SupportTicket = {
      id: "5",
      title: requestBody.title,
      description: requestBody.description,
      support_type: requestBody.support_type,
      created_at: new Date().toISOString(),
      author: "test_author",
      is_closed: false,
    };

    return HttpResponse.json<SupportTicket>(supportTicket);
  }),
];

type SupportTicketTypes = "bug" | "feature" | "question";

type SupportTicket = {
  id: string;
  title: string;
  support_type: SupportTicketTypes;
  description: string;
  is_closed: boolean;

  created_at: string;
  author: string;
};

import { z } from "zod";

export const SupportTypes = ["bug", "feature", "question"] as const;

export const supportTicketAddFormSchema = z.object({
  title: z.string().min(1, "Title must be at least 1 character"),
  support_type: z.enum(SupportTypes),
  description: z.string().min(1, "Description must be at least 1 character"),
});

export type SupportTicketAddFormSchema = z.infer<
  typeof supportTicketAddFormSchema
>;

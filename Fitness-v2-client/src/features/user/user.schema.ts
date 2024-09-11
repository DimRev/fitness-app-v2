import { z } from "zod";

export const userRoles = ["admin", "user"] as const;

export const userEditFormSchema = z.object({
  username: z.string().min(1, "Username must be at least 1 character"),
  email: z.string().email(),
  image_url: z
    .string()
    .transform((val) => {
      const str = String(val);
      return str.trim() === "" ? null : str;
    })
    .nullable(),
  role: z.enum(userRoles),
});

export type UserEditFormSchema = z.infer<typeof userEditFormSchema>;

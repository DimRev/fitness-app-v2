import { z } from "zod";

export const settingsEditFormSchema = z.object({
  username: z.string().min(1, "Name must be at least 1 character"),
  email: z.string().email(),
  image_url: z
    .string()
    .transform((val) => {
      const str = String(val);
      return str.trim() === "" ? null : str;
    })
    .nullable(),
});

export type SettingsEditFormSchema = z.infer<typeof settingsEditFormSchema>;

import { z } from "zod";

export const mealFormSchema = z.object({
  name: z.string().min(1),
  description: z
    .string()
    .optional()
    .transform((val) => {
      const str = String(val);
      return str.trim() === "" ? null : str;
    }),
  food_items: z.array(
    z.object({
      food_item_id: z.string().uuid(),
      amount: z.number().min(1),
    }),
  ),
});

export type MealFormSchema = z.infer<typeof mealFormSchema>;

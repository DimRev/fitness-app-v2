import { z } from "zod";

export const mealFormSchema = z.object({
  name: z.string().min(1, "Name must be at least 1 character"),
  description: z
    .string()
    .optional()
    .transform((val) => {
      const str = String(val);
      return str.trim() === "" ? null : str;
    }),
  food_items: z
    .array(
      z.object({
        food_item_id: z.string().uuid(),
        amount: z.number().min(1),
      }),
    )
    .min(1, "At least 1 food item is required"),
});

export type MealFormSchema = z.infer<typeof mealFormSchema>;

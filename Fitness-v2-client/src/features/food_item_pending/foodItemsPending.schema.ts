import { z } from "zod";

export const foodTypes = ["vegetable", "fruit", "grain", "protein"] as const;

export const foodItemPendingFormSchema = z.object({
  name: z.string().min(1),
  description: z
    .string()
    .optional()
    .transform((val) => {
      const str = String(val);
      return str.trim() === "" ? null : str;
    }),
  image_url: z
    .string()
    .optional()
    .transform((val) => {
      const str = String(val);
      return str.trim() === "" ? null : str;
    }),
  food_type: z.enum(foodTypes),
  calories: z
    .preprocess(
      (val) => {
        const num = Number(val);
        if (isNaN(num)) throw new Error("Calories must be a valid number");
        return num;
      },
      z.number().min(0, { message: "Calories must be greater then 0" }),
    )
    .transform((num) => String(num)),
  fat: z
    .preprocess(
      (val) => {
        const num = Number(val);
        if (isNaN(num)) throw new Error("Fat must be a valid number");
        return num;
      },
      z.number().min(0, { message: "Fat must be greater then 0" }),
    )
    .transform((num) => String(num)),
  protein: z
    .preprocess(
      (val) => {
        const num = Number(val);
        if (isNaN(num)) throw new Error("Protein must be a valid number");
        return num;
      },
      z.number().min(0, { message: "Protein must be greater then 0" }),
    )
    .transform((num) => String(num)),
  carbs: z
    .preprocess(
      (val) => {
        const num = Number(val);
        if (isNaN(num)) throw new Error("Carbs must be a valid number");
        return num;
      },
      z.number().min(0, { message: "Carbs must be greater then 0" }),
    )
    .transform((num) => String(num)),
});

export type FoodItemPendingFormSchema = z.infer<
  typeof foodItemPendingFormSchema
>;

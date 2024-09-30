import { z } from "zod";

export const measurementSchema = z.object({
  weight: z
    .preprocess(
      (val) => {
        const num = Number(val);
        if (isNaN(num)) throw new Error("Weight must be a valid number");
        return num;
      },
      z.number().min(0, { message: "Weight must be greater then 0" }),
    )
    .transform((num) => String(num)),
  height: z
    .preprocess(
      (val) => {
        const cmHeight = Number(val);
        if (isNaN(cmHeight)) throw new Error("Height must be a valid number");
        const mHeight = cmHeight / 100;
        return mHeight;
      },
      z.number().min(0, { message: "Height must be greater then 0" }),
    )
    .transform((num) => String(num)),
});

export type MeasurementSchema = z.infer<typeof measurementSchema>;

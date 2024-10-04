import { authHandlers } from "~/features/auth/auth.mockHandlers";
import { calendarHandlers } from "~/features/calendar/calendar.mockHandlers";
import { chartHandlers } from "~/features/chart/chart.mockHandlers";
import { foodItemHandlers } from "~/features/food_item/foodItem.mockHandlers";

export const handlers = [
  ...authHandlers,
  ...chartHandlers,
  ...calendarHandlers,
  ...foodItemHandlers,
];

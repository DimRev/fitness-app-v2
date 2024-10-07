import { authHandlers } from "~/features/auth/auth.mockHandlers";
import { calendarHandlers } from "~/features/calendar/calendar.mockHandlers";
import { chartHandlers } from "~/features/chart/chart.mockHandlers";
import { foodItemHandlers } from "~/features/food_item/foodItem.mockHandlers";
import { foodItemsPendingHandlers } from "~/features/food_item_pending/foodItemsPending.mockHandlers";
import { mealMockHandlers } from "~/features/meal/meal.mockHandlers";
import { measurementMockHandlers } from "~/features/measurement/measurement.mockHandlers";

export const handlers = [
  ...authHandlers,
  ...chartHandlers,
  ...calendarHandlers,
  ...foodItemHandlers,
  ...foodItemsPendingHandlers,
  ...mealMockHandlers,
  ...measurementMockHandlers,
];

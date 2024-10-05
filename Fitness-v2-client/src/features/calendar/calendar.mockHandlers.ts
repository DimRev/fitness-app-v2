import { http, HttpResponse } from "msw";

export const calendarHandlers = [
  http.get("*/calendar", async ({ request }) => {
    const searchParams = new URL(request.url).searchParams;
    const date = searchParams.get("date");

    if (date === "2024-01-01T00:00:00.000Z") {
      const calendarData: CalendarData = {
        meals: [
          { meal_id: "1", name: "test meal 1" },
          { meal_id: "2", name: "test meal 2" },
          { meal_id: "3", name: "test meal 3" },
        ],
        total_calories: 1000,
        total_protein: 1000,
        total_carbs: 1000,
        total_fat: 1000,
      };
      return HttpResponse.json(calendarData, { status: 200 });
    }

    return HttpResponse.json(
      { message: "Failed to get calendar data, invalid date" },
      { status: 400 },
    );
  }),
];

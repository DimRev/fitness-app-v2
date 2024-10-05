import { http, HttpResponse } from "msw";

export const chartHandlers = [
  http.get("*/charts/meals", async () => {
    const mealsConsumedChartData: MealsConsumedChartData[] = [
      {
        date: "2024-01-01T00:00:00.000Z",
        total_calories: 1000,
        total_protein: 1000,
        total_carbs: 1000,
        total_fat: 1000,
      },
      {
        date: "2024-01-02T00:00:00.000Z",
        total_calories: 2000,
        total_protein: 2000,
        total_carbs: 2000,
        total_fat: 2000,
      },
      {
        date: "2024-01-03T00:00:00.000Z",
        total_calories: 3000,
        total_protein: 3000,
        total_carbs: 3000,
        total_fat: 3000,
      },
    ];

    return HttpResponse.json(mealsConsumedChartData, { status: 200 });
  }),
  http.get("*/charts/measurements", async () => {
    const measurementsChartData: MeasurementsChartData[] = [
      {
        date: "2024-01-01T00:00:00.000Z",
        bmi: 23.5,
        height: 170,
        weight: 80,
      },
      {
        date: "2024-01-02T00:00:00.000Z",
        bmi: 22.5,
        height: 170,
        weight: 70,
      },
      {
        date: "2024-01-03T00:00:00.000Z",
        bmi: 20.5,
        height: 170,
        weight: 60,
      },
    ];

    return HttpResponse.json(measurementsChartData, { status: 200 });
  }),
];

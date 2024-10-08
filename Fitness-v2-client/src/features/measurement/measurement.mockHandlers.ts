import { http, HttpResponse } from "msw";
import { type CreateMeasurementRequestBody } from "./hooks/useCreateMeasurement";

const MEASUREMENTS: Measurement[] = [
  {
    bmi: 1000,
    height: 1000,
    weight: 1000,
    date: "2024-01-01T00:00:00.000Z",
  },
  {
    bmi: 2000,
    height: 2000,
    weight: 2000,
    date: "2024-01-02T00:00:00.000Z",
  },
  {
    bmi: 3000,
    height: 3000,
    weight: 3000,
    date: "2024-01-03T00:00:00.000Z",
  },
  {
    bmi: 4000,
    height: 4000,
    weight: 4000,
    date: "2024-01-04T00:00:00.000Z",
  },
  {
    bmi: 5000,
    height: 5000,
    weight: 5000,
    date: "2024-01-05T00:00:00.000Z",
  },
  {
    bmi: 6000,
    height: 6000,
    weight: 6000,
    date: "2024-01-06T00:00:00.000Z",
  },
];

export const measurementMockHandlers = [
  http.get("*/measurements", async () => {
    return HttpResponse.json<Measurement[]>(MEASUREMENTS);
  }),

  http.post("*/measurements", async ({ request }) => {
    const requestBody = (await request.json()) as CreateMeasurementRequestBody;

    const currDate = new Date().toISOString().split("T")[0] + "T00:00:00.000Z";

    const measurement: Measurement = {
      bmi: Number(requestBody.weight) + Number(requestBody.height),
      height: Number(requestBody.height),
      weight: Number(requestBody.weight),
      date: currDate,
    };

    return HttpResponse.json<Measurement>(measurement);
  }),

  http.get("*/measurements/check", async () => {
    const currDate = new Date().toISOString().split("T")[0] + "T00:00:00.000Z";

    return HttpResponse.json<MeasurementToday>({
      isMeasuredToday: true,
      measurement: {
        bmi: 1234,
        height: 1000,
        weight: 1000,
        date: currDate,
      },
    });
  }),
];

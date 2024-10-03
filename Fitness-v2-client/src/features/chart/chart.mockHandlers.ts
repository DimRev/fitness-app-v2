import { http } from "msw";

export const chartHandlers = [http.get("*/chart/getChartData", async () => {})];

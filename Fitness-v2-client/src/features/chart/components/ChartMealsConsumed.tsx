import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { DashboardContentCards } from "~/features/shared/components/CustomCards";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "~/features/shared/components/ui/chart";
import useGetChartDataMealsConsumed from "../hooks/useGetChartDataMealsConsumed";

const initChartData = [
  {
    date: new Date(Date.now() + 1000 * 60 * 60 * 24),
    total_calories: 186,
    total_fat: 80,
    total_protein: 40,
    total_carbs: 20,
  },
  {
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
    total_calories: 305,
    total_fat: 200,
    total_protein: 40,
    total_carbs: 20,
  },
  {
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
    total_calories: 237,
    total_fat: 120,
    total_protein: 40,
    total_carbs: 20,
  },
  {
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4),
    total_calories: 73,
    total_fat: 190,
    total_protein: 40,
    total_carbs: 20,
  },
  {
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
    total_calories: 209,
    total_fat: 130,
    total_protein: 40,
    total_carbs: 20,
  },
  {
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6),
    total_calories: 214,
    total_fat: 140,
    total_protein: 40,
    total_carbs: 20,
  },
];

const chartConfig = {
  total_calories: {
    label: "Total Calories",
    color: "#2563eb",
  },
  total_fat: {
    label: "Total Fat",
    color: "#60a5fa",
  },
  total_protein: {
    label: "Total Protein",
    color: "#f59e0b",
  },
  total_carbs: {
    label: "Total Carbs",
    color: "#f59e0b",
  },
} satisfies ChartConfig;

function ChartMealsConsumed() {
  const [chartData, setChartData] = useState(initChartData);
  const { data: mealsConsumedChartData } = useGetChartDataMealsConsumed({});
  useEffect(() => {
    if (mealsConsumedChartData) {
      const filledData = fillMissingDates(mealsConsumedChartData);
      setChartData(
        filledData.map((item) => ({
          ...item,
          date: new Date(item.date),
        })),
      );
    }
  }, [mealsConsumedChartData]);

  function fillMissingDates(
    data: MealsConsumedChartData[],
  ): MealsConsumedChartData[] {
    if (data.length === 0) return [];
    const firstDate = new Date(data[0].date);
    const lastDate = new Date(data[data.length - 1].date);
    const diffTimestamp = lastDate.getTime() - firstDate.getTime();
    const diffDays = Math.ceil(diffTimestamp / (1000 * 60 * 60 * 24));

    const dateMap: Record<string, MealsConsumedChartData> = {};
    for (const item of data) {
      const itemDate = new Date(item.date).toISOString().split("T")[0];
      dateMap[itemDate] = item;
    }

    const currentDate = firstDate;
    const filledData: MealsConsumedChartData[] = [];

    for (let i = 0; i <= diffDays; i++) {
      const currentISOString = currentDate.toISOString().split("T")[0];
      if (dateMap[currentISOString]) {
        filledData.push(dateMap[currentISOString]);
      } else {
        filledData.push({
          date: currentISOString,
          total_calories: 0,
          total_fat: 0,
          total_protein: 0,
          total_carbs: 0,
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return filledData;
  }

  return (
    <DashboardContentCards title="Meals Chart">
      <ChartContainer config={chartConfig} className="w-full max-h-96">
        <LineChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value: Date) =>
              value.toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            }
          />
          <ChartTooltip content={<ChartTooltipContent className="w-40" />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Line
            dataKey="total_calories"
            stroke="var(--color-total_calories)"
            fill="var(--color-total_calories)"
            type="monotone"
            radius={2}
          />
          <Line
            dataKey="total_fat"
            stroke="var(--color-total_fat)"
            fill="var(--color-total_fat)"
            type="monotone"
            radius={2}
          />
          <Line
            dataKey="total_protein"
            stroke="var(--color-total_protein)"
            fill="var(--color-total_protein)"
            type="monotone"
            radius={2}
          />
          <Line
            dataKey="total_carbs"
            stroke="var(--color-total_carbs)"
            fill="var(--color-total_carbs)"
            type="monotone"
            radius={2}
          />
        </LineChart>
      </ChartContainer>
    </DashboardContentCards>
  );
}

export default ChartMealsConsumed;

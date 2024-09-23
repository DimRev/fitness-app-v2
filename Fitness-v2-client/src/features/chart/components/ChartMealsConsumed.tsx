import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { DashboardContentCards } from "~/features/shared/components/CustomCards";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/features/shared/components/ui/chart";
import useGetChartDataMealsConsumed from "../hooks/useGetChartDataMealsConsumed";
import { useEffect, useState } from "react";

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

// const chartConfig = {
//   desktop: {
//     label: "Desktop",
//     color: "#2563eb",
//   },
//   mobile: {
//     label: "Mobile",
//     color: "#60a5fa",
//   },
// } satisfies ChartConfig;

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
};

function ChartMealsConsumed() {
  const [chartData, setChartData] = useState(initChartData);
  const { data: mealsConsumedChartData } = useGetChartDataMealsConsumed({});
  console.log(mealsConsumedChartData);
  useEffect(() => {
    if (mealsConsumedChartData) {
      setChartData(
        mealsConsumedChartData.map((item) => ({
          ...item,
          date: new Date(item.date),
        })),
      );
    }
  }, [mealsConsumedChartData]);
  return (
    <DashboardContentCards title="Meals Chart">
      <ChartContainer config={chartConfig} className="max-h-96 w-full">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value: Date) => value.toLocaleString()}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar
            dataKey="total_calories"
            fill="var(--color-total_calories)"
            radius={4}
          />
          <Bar dataKey="total_fat" fill="var(--color-total_fat)" radius={4} />
          <Bar
            dataKey="total_protein"
            fill="var(--color-total_protein)"
            radius={4}
          />
          <Bar
            dataKey="total_carbs"
            fill="var(--color-total_carbs)"
            radius={4}
          />
        </BarChart>
      </ChartContainer>
    </DashboardContentCards>
  );
}

export default ChartMealsConsumed;

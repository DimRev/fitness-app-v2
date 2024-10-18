import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import useGetCheckTodayMeasurement from "~/features/measurement/hooks/useGetCheckTodayMeasurement";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from "~/features/shared/components/ui/chart";
import useGetChartDataMealsConsumed from "../hooks/useGetChartDataMealsConsumed";
import ChartTooltipDate from "./ChartTooltipDate";

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
    label: "Total Calories (kcal)",
    color: "#2563eb",
  },
  total_fat: {
    label: "Total Fat (g)",
    color: "#60a5fa",
  },
  total_protein: {
    label: "Total Protein (g)",
    color: "#f59e0b",
  },
  total_carbs: {
    label: "Total Carbs (g)",
    color: "#f59e0b",
  },
} satisfies ChartConfig;

function ChartMealsConsumed() {
  const [chartData, setChartData] = useState(initChartData);

  const { data: mealsConsumedChartData } = useGetChartDataMealsConsumed();
  const { data: todayMeasurement } = useGetCheckTodayMeasurement();
  useEffect(() => {
    if (mealsConsumedChartData) {
      const filledData = fillMissingDates(mealsConsumedChartData);
      setChartData(
        filledData.map((item) => ({
          ...item,
          date: new Date(item.date),
        })),
      );
    } else {
      setChartData(initChartData);
    }
  }, [mealsConsumedChartData]);

  const referenceLineData = useMemo(() => {
    if (!todayMeasurement?.measurement) return null;

    const W = todayMeasurement.measurement.weight;
    const H = todayMeasurement.measurement.height;
    const A = 33;
    const G = "male";

    if (G === "male") {
      return 10 * W + 625 * H - 5 * A + 5;
    } else {
      return 10 * W + 625 * H - 5 * A - 161;
    }
  }, [todayMeasurement]);

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

  const maxValue = useMemo(() => {
    if (chartData.length === 0) {
      return 500;
    }
    let max = 0;
    chartData.forEach((item) => {
      const localMax = Math.max(
        item.total_calories,
        item.total_carbs,
        item.total_fat,
        item.total_protein,
      );
      if (localMax > max) {
        max = localMax;
      }
    });
    return Math.floor((max * 2) / 100) * 100;
  }, [chartData]);

  return (
    <ChartContainer config={chartConfig} className="max-h-96 w-full">
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
        <YAxis
          domain={
            referenceLineData
              ? [
                  0,
                  Math.max(
                    Math.floor((referenceLineData * 2) / 100) * 100,
                    maxValue,
                  ),
                ]
              : [0, maxValue]
          }
          dataKey="total_calories"
          tickFormatter={(value: number) => `${value}`}
        />
        {referenceLineData && (
          <ReferenceLine
            y={referenceLineData}
            label="Basal Metabolic Rate (kCal)"
            className="text-red-500"
            stroke="red"
            strokeDasharray="3 3"
            position="start"
          />
        )}
        <ChartTooltip
          content={({ payload }) => {
            const KeyLabels = [
              { key: "total_calories", label: "Total Calories(kCal)" },
              { key: "total_fat", label: "Total Fat(g)" },
              { key: "total_protein", label: "Total Protein(g)" },
              { key: "total_carbs", label: "Total Carbs(g)" },
            ];
            return <ChartTooltipDate keyLabels={KeyLabels} payload={payload} />;
          }}
        />

        <ChartLegend content={<ChartLegendContent />} />
        <Line
          dataKey="total_calories"
          stroke="var(--color-total_calories)"
          fill="var(--color-total_calories)"
          type="monotone"
          dot={false}
          radius={2}
        />
        <Line
          dataKey="total_fat"
          stroke="var(--color-total_fat)"
          fill="var(--color-total_fat)"
          type="monotone"
          dot={false}
          radius={2}
        />
        <Line
          dataKey="total_protein"
          stroke="var(--color-total_protein)"
          fill="var(--color-total_protein)"
          type="monotone"
          dot={false}
          radius={2}
        />
        <Line
          dataKey="total_carbs"
          stroke="var(--color-total_carbs)"
          fill="var(--color-total_carbs)"
          type="monotone"
          dot={false}
          radius={2}
        />
      </LineChart>
    </ChartContainer>
  );
}

export default ChartMealsConsumed;

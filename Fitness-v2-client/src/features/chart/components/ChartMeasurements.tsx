import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "~/features/shared/components/ui/chart";
import useGetChartDataMeasurements from "../hooks/useGetChartDataMeasurements";

const initChartData = [
  {
    date: new Date(Date.now() + 1000 * 60 * 60 * 24),
    weight: 186,
    height: 80,
    bmi: 10,
  },
  {
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
    weight: 305,
    height: 200,
    bmi: 20,
  },
  {
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
    weight: 237,
    height: 120,
    bmi: 150,
  },
  {
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4),
    weight: 73,
    height: 190,
    bmi: 30,
  },
];

const chartConfig = {
  weight: {
    label: "Weight(kg)",
    color: "#2563eb",
  },
  height: {
    label: "Height(cm)",
    color: "#60a5fa",
  },
  bmi: {
    label: "BMI",
    color: "#f59e0b",
  },
} satisfies ChartConfig;

function ChartMeasurements() {
  const [chartData, setChartData] = useState(initChartData);
  const { data: mealsConsumedChartData } = useGetChartDataMeasurements({});
  useEffect(() => {
    if (mealsConsumedChartData) {
      const filledData = fillMissingDates(mealsConsumedChartData);
      console.log(filledData);
      setChartData(
        filledData.map((item) => ({
          ...item,
          height: item.height * 100,
          date: new Date(item.date),
        })),
      );
    }
  }, [mealsConsumedChartData]);

  function fillMissingDates(
    data: MeasurementsChartData[],
  ): MeasurementsChartData[] {
    if (data.length === 0) return [];
    const firstDate = new Date(data[0].date);
    const lastDate = new Date(data[data.length - 1].date);
    const diffTimestamp = lastDate.getTime() - firstDate.getTime();
    const diffDays = Math.ceil(diffTimestamp / (1000 * 60 * 60 * 24));

    const dateMap: Record<string, MeasurementsChartData> = {};
    for (const item of data) {
      const itemDate = new Date(item.date).toISOString().split("T")[0];
      dateMap[itemDate] = item;
    }

    const currentDate = firstDate;
    let prevExistingDateISOstring = "";
    const filledData: MeasurementsChartData[] = [];

    for (let i = 0; i <= diffDays; i++) {
      const currentISOString = currentDate.toISOString().split("T")[0];
      if (dateMap[currentISOString]) {
        filledData.push(dateMap[currentISOString]);
        prevExistingDateISOstring = currentISOString;
      } else {
        filledData.push(dateMap[prevExistingDateISOstring]);
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return filledData;
  }

  return (
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
          dataKey="weight"
          stroke="var(--color-weight)"
          fill="var(--color-weight)"
          type="monotone"
          radius={2}
        />
        <Line
          dataKey="height"
          stroke="var(--color-height)"
          fill="var(--color-height)"
          type="monotone"
          radius={2}
        />
        <Line
          dataKey="bmi"
          stroke="var(--color-bmi)"
          fill="var(--color-bmi)"
          type="monotone"
          radius={2}
        />
      </LineChart>
    </ChartContainer>
  );
}

export default ChartMeasurements;

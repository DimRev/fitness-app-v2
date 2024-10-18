import { useEffect, useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Card } from "~/features/shared/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from "~/features/shared/components/ui/chart";
import { Separator } from "~/features/shared/components/ui/separator";
import { cn } from "~/lib/utils";
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
  const { data: mealsConsumedChartData } = useGetChartDataMeasurements();
  useEffect(() => {
    if (mealsConsumedChartData) {
      const filledData = fillMissingDates(mealsConsumedChartData);
      setChartData(
        filledData.map((item) => ({
          ...item,
          height: item.height * 100,
          date: new Date(item.date),
        })),
      );
    } else {
      setChartData(initChartData);
    }
  }, [mealsConsumedChartData]);

  function fillMissingDates(
    data: MeasurementsChartData[],
  ): MeasurementsChartData[] {
    if (data.length === 0) return [];
    const firstDate = new Date(
      new Date(data[0].date).toISOString().split("T")[0] + "T00:00:00.000Z",
    );
    const lastDate = new Date(
      new Date(data[data.length - 1].date).toISOString().split("T")[0] +
        "T00:00:00.000Z",
    );
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
        filledData.push({
          ...dateMap[prevExistingDateISOstring],
          date: currentDate.toISOString(),
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
      const localMax = Math.max(item.bmi, item.height, item.weight);
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
          dataKey="weight"
          domain={[0, maxValue]}
          tickFormatter={(value: number) => `${value}`}
        />
        {/* <ChartTooltip
          content={<ChartTooltipContent hideLabel className="w-40" />}
        /> */}
        <ChartTooltip
          content={({ payload }) => {
            if (!payload || payload.length === 0) return null;
            const { date, weight, height, bmi } = payload[0].payload as {
              date: Date;
              weight: number;
              height: number;
              bmi: number;
            };
            return (
              <Card className="w-44 border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
                <div className="py-1">
                  <p>{new Date(date).toDateString()}</p>
                </div>
                <Separator />

                <div className="grid grid-cols-[auto_auto_1fr] items-center gap-1 pt-1">
                  <div
                    className={cn(
                      "h-2.5 w-2.5 shrink-0 rounded-[2px] border-[--color-weight] bg-[--color-weight]",
                    )}
                  />
                  <p className="text-muted-foreground">Weight(kg)</p>
                  <p className="text-end">{weight}</p>
                  <div
                    className={cn(
                      "h-2.5 w-2.5 shrink-0 rounded-[2px] border-[--color-height] bg-[--color-height]",
                    )}
                  />
                  <p className="text-muted-foreground">Height(cm)</p>
                  <p className="text-end">{height}</p>
                  <div
                    className={cn(
                      "h-2.5 w-2.5 shrink-0 rounded-[2px] border-[--color-bmi] bg-[--color-bmi]",
                    )}
                  />
                  <p className="text-muted-foreground">BMI</p>
                  <p className="text-end">{bmi}</p>
                </div>
              </Card>
            );
          }}
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          dataKey="weight"
          stroke="var(--color-weight)"
          fill="var(--color-weight)"
          type="monotone"
          dot={false}
          radius={2}
        />
        <Line
          dataKey="height"
          stroke="var(--color-height)"
          fill="var(--color-height)"
          type="monotone"
          dot={false}
          radius={2}
        />
        <Line
          dataKey="bmi"
          stroke="var(--color-bmi)"
          fill="var(--color-bmi)"
          type="monotone"
          dot={false}
          radius={2}
        />
      </LineChart>
    </ChartContainer>
  );
}

export default ChartMeasurements;

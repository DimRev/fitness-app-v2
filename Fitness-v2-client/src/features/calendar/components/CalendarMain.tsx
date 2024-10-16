import { useEffect, useMemo, useState } from "react";
import { DashboardContentCards } from "~/features/shared/components/CustomCards";
import useGetCalendarDataByDate from "../hooks/useGetCalendarDataByDate";
import CalendarMainDatePreview from "./CalendarMainDatePreview";
import CalendarView, { type CalendarMatchers } from "./CalendarView";
import useGetChartDataMealsConsumed from "~/features/chart/hooks/useGetChartDataMealsConsumed";
import { useNavigate } from "react-router-dom";
import { Button } from "~/features/shared/components/ui/button";

const modifiersStyles = {
  "very-good": "bg-green-600 text-zinc-800",
  good: "bg-green-500 text-zinc-700",
  normal: "bg-yellow-500 text-zinc-500",
  bad: "bg-red-500 text-zinc-200",
  "very-bad": "bg-red-600 text-zinc-100",
  selected: "!bg-blue-500 !text-zinc-100",
};

function CalendarMain() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [matchers, setMatchers] = useState<CalendarMatchers>({
    good: [],
    bad: [],
    normal: [],
    "very-bad": [],
    "very-good": [],
  });
  const [calDateMap, setCalDateMap] = useState<Record<string, number>>({});

  const navigate = useNavigate();

  const formattedDate = useMemo(() => {
    if (!selectedDate) return;
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + 1);
    return date;
  }, [selectedDate]);

  const { data: calendarData, isLoading } = useGetCalendarDataByDate({
    date: formattedDate,
  });
  const { data: mealsConsumedChartData } = useGetChartDataMealsConsumed();

  useEffect(() => {
    const currMatchers: CalendarMatchers = {
      good: [],
      bad: [],
      normal: [],
      "very-bad": [],
      "very-good": [],
    };
    const currCalDateMap: Record<string, number> = {};

    if (mealsConsumedChartData) {
      const filledMealsConsumedChartData = fillMissingDates(
        mealsConsumedChartData,
      );

      filledMealsConsumedChartData.forEach((mealsConsumedDataRow) => {
        currCalDateMap[
          new Date(mealsConsumedDataRow.date).toISOString().split("T")[0]
        ] = mealsConsumedDataRow.total_calories;

        if (mealsConsumedDataRow.total_calories > 200) {
          currMatchers["very-good"].push(new Date(mealsConsumedDataRow.date));
        } else if (mealsConsumedDataRow.total_calories > 100) {
          currMatchers.good.push(new Date(mealsConsumedDataRow.date));
        } else if (mealsConsumedDataRow.total_calories > 50) {
          currMatchers.normal.push(new Date(mealsConsumedDataRow.date));
        } else if (mealsConsumedDataRow.total_calories > 20) {
          currMatchers.bad.push(new Date(mealsConsumedDataRow.date));
        } else {
          currMatchers["very-bad"].push(new Date(mealsConsumedDataRow.date));
        }
      });
    }

    setCalDateMap(currCalDateMap);
    setMatchers(currMatchers);
  }, [mealsConsumedChartData]);

  const modifiers = {
    good: matchers.good,
    bad: matchers.bad,
    normal: matchers.normal,
    "very-bad": matchers["very-bad"],
    "very-good": matchers["very-good"],
  };

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

  function handleDateDetails() {
    if (!selectedDate) return;
    navigate(`/dashboard/calendar/${selectedDate.toISOString()}`);
  }

  return (
    <DashboardContentCards title="Calendar">
      <div className="lg:flex">
        <div className="lg:flex-[5]">
          <CalendarView
            matchers={matchers}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            caloriesDateMap={calDateMap}
          />
          <div className="flex justify-end px-3 max-lg:hidden">
            <Button disabled={!selectedDate} onClick={handleDateDetails}>
              {selectedDate ? "Details" : "Select"}
            </Button>
          </div>
        </div>
        <div className="lg:flex-[3]">
          <CalendarMainDatePreview
            calendarData={calendarData}
            calendarDataLoading={isLoading}
            selectedDate={selectedDate}
          />
          <div className="flex justify-end pt-4 lg:hidden">
            <Button disabled={!selectedDate} onClick={handleDateDetails}>
              {selectedDate ? "Details" : "Select"}
            </Button>
          </div>
        </div>
      </div>
    </DashboardContentCards>
  );
}

export default CalendarMain;

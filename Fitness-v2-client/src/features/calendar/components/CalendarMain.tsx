import { DashboardContentCards } from "~/features/shared/components/CustomCards";
import CalendarView, { type CalendarMatchers } from "./CalendarView";
import { useEffect, useState } from "react";
import { H3 } from "~/features/shared/components/Typography";
import { Separator } from "~/features/shared/components/ui/separator";

const modifiersStyles = {
  "very-good": "bg-green-600 text-zinc-800",
  good: "bg-green-500 text-zinc-700",
  normal: "bg-yellow-500 text-zinc-500",
  bad: "bg-red-500 text-zinc-200",
  "very-bad": "bg-red-600 text-zinc-100",
  selected: "!bg-blue-500 !text-zinc-100",
};

function CalendarMain() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [matchers, setMatchers] = useState<CalendarMatchers>({
    good: [],
    bad: [],
    normal: [],
    "very-bad": [],
    "very-good": [],
  });

  useEffect(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    setMatchers({
      good: [yesterday],
      bad: [],
      normal: [twoDaysAgo],
      "very-bad": [threeDaysAgo],
      "very-good": [],
    });
  }, []);

  const modifiers = {
    good: matchers.good,
    bad: matchers.bad,
    normal: matchers.normal,
    "very-bad": matchers["very-bad"],
    "very-good": matchers["very-good"],
  };

  return (
    <DashboardContentCards title="Calendar">
      <div className="flex">
        <div className="flex-[5]">
          <CalendarView
            matchers={matchers}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
          />
        </div>
        <div className="flex-[3]">
          <H3>
            {selectedDate ? selectedDate.toDateString() : "Select a date"}
          </H3>
          <Separator />
        </div>
      </div>
    </DashboardContentCards>
  );
}

export default CalendarMain;

import { useEffect, useState } from "react";
import { DashboardContentCards } from "~/features/shared/components/CustomCards";
import { Button } from "~/features/shared/components/ui/button";
import { Calendar } from "~/features/shared/components/ui/calendar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/features/shared/components/ui/hover-card";
import { cn } from "~/lib/utils";

type CalendarMatchers = {
  good: Date[];
  bad: Date[];
  normal: Date[];
  "very-bad": Date[];
  "very-good": Date[];
};

const modifiersStyles = {
  veryGood: "bg-green-600 text-zinc-800",
  good: "bg-green-500 text-zinc-700",
  normal: "bg-yellow-500 text-zinc-500",
  bad: "bg-red-500 text-zinc-200",
  veryBad: "bg-red-600 text-zinc-100",
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
    veryBad: matchers["very-bad"],
    veryGood: matchers["very-good"],
  };

  function onDayClick(day: Date) {
    setSelectedDate(day);
  }

  function handleDateDetails() {
    if (!selectedDate) return;
  }

  return (
    <DashboardContentCards title="Calendar">
      <Calendar
        mode="single"
        showOutsideDays={false}
        footer={
          <div className="flex justify-end py-2">
            <Button disabled={!selectedDate} onClick={handleDateDetails}>
              {selectedDate ? "Details" : "Select"}
            </Button>
          </div>
        }
        initialFocus={false}
        onDayClick={onDayClick}
        className={cn(
          "min-h-[400px] w-full min-w-[500px]",
          "h-[calc(100dvh - 56px - 86px)]",
        )}
        classNames={{
          months:
            "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1 justify-center",
          month: "space-y-4 w-full flex flex-col",
          table:
            "w-full h-[calc(100dvh-400px)] min-h-[400px] border-collapse space-y-1 rounded-[10px]",
          head_row: "",
          row: "w-full mt-2 border",
          cell: "border p-0.5 w-[calc(5dvw)] h-[calc(5dvh)]",
          day: "h-[100%] w-[100%] rounded-[10px] font-bold text-lg max-lg:text-sm max-sm:text-xs  flex justify-center pt-2",
        }}
        modifiers={modifiers}
        modifiersClassNames={modifiersStyles}
        selected={selectedDate}
        onSelect={setSelectedDate}
        formatters={{
          formatDay: (day) => {
            function isToday(date: Date) {
              return (
                date.getDate() === new Date().getDate() &&
                date.getMonth() === new Date().getMonth() &&
                date.getFullYear() === new Date().getFullYear()
              );
            }

            function isStatus(date: Date) {
              const allDates = [
                ...matchers.good,
                ...matchers.bad,
                ...matchers.normal,
                ...matchers["very-bad"],
                ...matchers["very-good"],
              ];
              for (const currDate of allDates) {
                const dateMatch = currDate.getDate() === date.getDate();
                const monthMatch = currDate.getMonth() === date.getMonth();
                const yearMatch = currDate.getFullYear() === date.getFullYear();

                if (dateMatch && monthMatch && yearMatch) {
                  return true;
                }
              }
              return false;
            }

            if (isToday(day)) {
              return (
                <HoverCard>
                  <HoverCardTrigger>
                    <div className="flex flex-col h-[calc(9dvh)]">
                      <div className="w-[calc(5dvw)] truncate">
                        <span>{day.getDate()}</span>
                      </div>
                      <div className="border-2 bg-green-400 px-2 border-black rounded-md w-[calc(5dvw)] truncate">
                        <span>Today</span>
                      </div>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent>Today</HoverCardContent>
                </HoverCard>
              );
            }
            if (isStatus(day)) {
              <>
                <div className="flex flex-col h-[calc(9dvh)]">
                  <div className="w-[calc(5dvw)] truncate">
                    <span>{day.getDate()}</span>
                  </div>
                  <div className="border-2 bg-green-400 px-2 border-black rounded-md w-[calc(5dvw)] truncate">
                    <span></span>
                  </div>
                </div>
              </>;
            }

            return (
              <>
                <div className="flex flex-col h-[calc(9dvh)]">
                  <div className="w-[calc(5dvw)] truncate">
                    <span>{day.getDate()}</span>
                  </div>
                </div>
              </>
            );
          },
        }}
      />
    </DashboardContentCards>
  );
}

export default CalendarMain;

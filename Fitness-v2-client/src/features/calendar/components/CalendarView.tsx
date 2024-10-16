import { useNavigate } from "react-router-dom";
import { Button } from "~/features/shared/components/ui/button";
import { Calendar } from "~/features/shared/components/ui/calendar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/features/shared/components/ui/hover-card";
import { cn } from "~/lib/utils";

export type StatusTypes = "good" | "bad" | "normal" | "very-bad" | "very-good";

export type CalendarMatchers = {
  [key in StatusTypes]: Date[];
};

type Props = {
  selectedDate: Date | undefined;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  matchers: {
    [key in StatusTypes]: Date[];
  };
  modifiers: {
    [key in StatusTypes]: Date[];
  };
  modifiersStyles: {
    [key in StatusTypes | "selected"]: string;
  };
  caloriesDateMap: Record<string, number>;
};

function CalendarView({
  matchers,
  selectedDate,
  setSelectedDate,
  modifiers,
  modifiersStyles,
  caloriesDateMap,
}: Props) {
  const navigate = useNavigate();
  function onDayClick(day: Date) {
    setSelectedDate(day);
  }

  function handleDateDetails() {
    if (!selectedDate) return;
    navigate(`/dashboard/calendar/${selectedDate.toISOString()}`);
  }

  return (
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
      className={cn()}
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

          let selected = false;
          if (
            day.getDate() === selectedDate?.getDate() &&
            day.getMonth() === selectedDate?.getMonth() &&
            day.getFullYear() === selectedDate?.getFullYear()
          ) {
            selected = true;
          }
          const modifier = checkAndGetModifier(day) as string;
          const mStyles = {
            "very-good": "bg-green-400 text-zinc-500",
            good: "bg-green-400 text-zinc-600",
            normal: "bg-yellow-400 text-zinc-700",
            bad: "bg-red-400 text-zinc-800",
            "very-bad": "bg-red-400 text-zinc-900",
            selected: "bg-blue-400 text-zinc-600",
          };

          function checkAndGetModifier(date: Date) {
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
                const kvs = Object.entries(matchers);
                let currModifier;
                for (const [key, value] of kvs) {
                  if (value.includes(currDate)) {
                    currModifier = key;
                  }
                }
                return currModifier;
              }
            }
            return false;
          }

          function getCalories(date: Date) {
            const prevDate = new Date(date.getTime() + 1000 * 60 * 60 * 24)
              .toISOString()
              .split("T")[0];
            const calories = caloriesDateMap[prevDate];
            return calories;
          }

          if (isToday(day)) {
            const calories = getCalories(day);
            return (
              <HoverCard>
                <HoverCardTrigger>
                  <div className="flex h-[calc(9dvh)] flex-col">
                    <div className="w-[calc(5dvw)] truncate">
                      <span>{day.getDate()}</span>
                    </div>
                    <div
                      className={cn(
                        "w-[calc(5dvw)] truncate rounded-md border-2 border-black bg-orange-400 px-2 text-sm text-zinc-100",
                        selected && mStyles.selected,
                      )}
                    >
                      <div className="flex flex-col">
                        <span>Today</span>
                        {!!calories && <span>{calories} cal</span>}
                      </div>
                    </div>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent>Today</HoverCardContent>
              </HoverCard>
            );
          }
          if (checkAndGetModifier(day)) {
            const calories = getCalories(day);

            return (
              <>
                <div className="flex h-[calc(9dvh)] flex-col">
                  <div className="w-[calc(5dvw)] truncate">
                    <span>{day.getDate()}</span>
                  </div>
                  <div
                    className={cn(
                      "w-[calc(5dvw)] truncate rounded-md border-2 border-black px-2 text-sm",
                      mStyles[modifier as keyof typeof mStyles],
                      selected && mStyles.selected,
                    )}
                  >
                    <span>{calories} cal</span>
                  </div>
                </div>
              </>
            );
          }

          return (
            <>
              <div className="flex h-[calc(9dvh)] flex-col">
                <div className="w-[calc(5dvw)] truncate">
                  <span>{day.getDate()}</span>
                </div>
              </div>
            </>
          );
        },
      }}
    />
  );
}

export default CalendarView;

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
};

function CalendarView({
  matchers,
  selectedDate,
  setSelectedDate,
  modifiers,
  modifiersStyles,
}: Props) {
  function onDayClick(day: Date) {
    setSelectedDate(day);
  }

  function handleDateDetails() {
    if (!selectedDate) return;
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
                  <div className="flex h-[calc(9dvh)] flex-col">
                    <div className="w-[calc(5dvw)] truncate">
                      <span>{day.getDate()}</span>
                    </div>
                    <div className="w-[calc(5dvw)] truncate rounded-md border-2 border-black bg-green-400 px-2">
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
              <div className="flex h-[calc(9dvh)] flex-col">
                <div className="w-[calc(5dvw)] truncate">
                  <span>{day.getDate()}</span>
                </div>
                <div className="w-[calc(5dvw)] truncate rounded-md border-2 border-black bg-green-400 px-2">
                  <span></span>
                </div>
              </div>
            </>;
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
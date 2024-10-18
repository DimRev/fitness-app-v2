import { useMemo } from "react";
import { DashboardContentCards } from "~/features/shared/components/CustomCards";
import useGetCalendarDataByDate from "../hooks/useGetCalendarDataByDate";
import { H2 } from "~/features/shared/components/Typography";
import {
  Card,
  CardContent,
  CardHeader,
} from "~/features/shared/components/ui/card";
import { Separator } from "~/features/shared/components/ui/separator";
import { buttonVariants } from "~/features/shared/components/ui/button";
import { Link } from "react-router-dom";

type Props = {
  dateStr: string;
};

function CalendarDetailsContent({ dateStr }: Props) {
  const formattedDate = useMemo(() => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1);
    return date;
  }, [dateStr]);

  const {
    data: calendarData,
    isLoading,
    error,
    isError,
  } = useGetCalendarDataByDate({
    date: formattedDate,
  });

  if (isLoading) return <div>Loading...</div>;

  if (isError || !calendarData) return <div>Error: {error?.message}</div>;

  return (
    <DashboardContentCards
      title={`Calendar Details - ${new Date(dateStr).toLocaleDateString(
        "en-US",
        {
          dateStyle: "long",
        },
      )}`}
    >
      <Card>
        <CardHeader>
          <H2>Meals</H2>
          <Separator />
        </CardHeader>
        <CardContent>
          {calendarData.meals.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {calendarData.meals.map((meal) => (
                <Link
                  to={`/dashboard/meal/details/${meal.meal_id}`}
                  key={meal.meal_id}
                  className={buttonVariants({ variant: "outline" })}
                >
                  {meal.name}
                </Link>
              ))}
            </div>
          ) : (
            <div>No meals</div>
          )}
        </CardContent>
        <CardHeader>
          <H2>Total Nutritional Values</H2>
          <Separator />
        </CardHeader>
        <CardContent>
          <div className="w-fit">
            <div className="grid grid-cols-3 items-center">
              <span className="text-end">Calories:</span>
              <div className="mx-5 h-[1px] w-10 bg-foreground" />
              <span className="">
                {calendarData.total_calories}
                <span className="text-xs text-foreground">(kcal)</span>
              </span>
            </div>
            <div className="grid grid-cols-3 items-center">
              <span className="text-end">Carbs: </span>
              <div className="mx-5 h-[1px] w-10 bg-foreground" />
              <span className="">
                {calendarData.total_carbs}
                <span className="text-xs text-foreground">(g)</span>
              </span>
            </div>
            <div className="grid grid-cols-3 items-center">
              <span className="text-end">Fat: </span>
              <div className="mx-5 h-[1px] w-10 bg-foreground" />
              <span className="">
                {calendarData.total_fat}
                <span className="text-xs text-foreground">(g)</span>
              </span>
            </div>
            <div className="grid grid-cols-3 items-center">
              <span className="text-end">Protein: </span>
              <div className="mx-5 h-[1px] w-10 bg-foreground" />
              <span className="">
                {calendarData.total_protein}
                <span className="text-xs text-foreground">(g)</span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardContentCards>
  );
}

export default CalendarDetailsContent;

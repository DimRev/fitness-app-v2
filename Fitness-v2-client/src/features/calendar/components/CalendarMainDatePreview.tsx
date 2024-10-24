import { Link } from "react-router-dom";
import { H3 } from "~/features/shared/components/Typography";
import { buttonVariants } from "~/features/shared/components/ui/button";
import { Separator } from "~/features/shared/components/ui/separator";

type Props = {
  calendarData: CalendarData | undefined;
  calendarDataLoading: boolean;
  selectedDate: Date | undefined;
};

function CalendarMainDatePreview({
  calendarData,
  calendarDataLoading,
  selectedDate,
}: Props) {
  if (calendarDataLoading)
    return (
      <div>
        <H3>{selectedDate ? selectedDate.toDateString() : "Select a date"}</H3>
        <Separator />
        <div className="px-4">
          <div className="border-b py-2">
            <H3>Meals</H3>
          </div>
          <div className="px-2">
            <div className="py-2">Loading...</div>
          </div>
        </div>
        <Separator />
        <div className="px-4">
          <div className="border-b py-2">
            <H3>Nutritional Values</H3>
          </div>
          <div className="px-2">
            <div className="py-2">Loading...</div>
          </div>
        </div>
        <Separator />
      </div>
    );

  if (!selectedDate) {
    return (
      <div>
        <H3>Select a date</H3>
        <Separator />
        <div className="px-4">
          <div className="border-b py-2">
            <H3>Meals</H3>
          </div>
          <div className="px-2">
            <div className="py-2">
              Select a date to see the meals and nutritional values
            </div>
          </div>
        </div>
        <Separator />
        <div className="px-4">
          <div className="border-b py-2">
            <H3>Nutritional Values</H3>
          </div>
          <div className="px-2">
            <div className="py-2">
              Select a date to see the meals and nutritional values
            </div>
          </div>
        </div>
        <Separator />
      </div>
    );
  }

  return (
    <div>
      <H3>{selectedDate ? selectedDate.toDateString() : "Select a date"}</H3>
      <Separator />
      <div className="px-4">
        <div className="border-b py-2">
          <H3>Meals</H3>
        </div>
        <div className="flex flex-wrap gap-2 py-2">
          {calendarData?.meals?.map((meals) => (
            <Link
              to={`/dashboard/meal/details/${meals.meal_id}`}
              key={meals.meal_id}
              className={buttonVariants({ variant: "outline" })}
            >
              {meals.name}
            </Link>
          ))}
          {calendarData?.meals?.length === 0 && (
            <div className="py-2">No meals recorded</div>
          )}
        </div>
      </div>
      <Separator />
      <div className="px-4">
        <div className="border-b py-2">
          <H3>Nutritional Values</H3>
        </div>
        <div className="px-2">
          <div className="flex items-center justify-between gap-4">
            <div>Total calories:</div>
            <div className="h-[1px] flex-1 bg-foreground"></div>
            <div>{calendarData?.total_calories ?? 0}</div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>Total fats:</div>
            <div className="h-[1px] flex-1 bg-foreground"></div>
            <div>{calendarData?.total_fat ?? 0}</div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>Total protein:</div>
            <div className="h-[1px] flex-1 bg-foreground"></div>
            <div>{calendarData?.total_protein ?? 0}</div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>Total carbs:</div>
            <div className="h-[1px] flex-1 bg-foreground"></div>
            <div>{calendarData?.total_carbs ?? 0}</div>
          </div>
        </div>
      </div>
      <Separator />
    </div>
  );
}

export default CalendarMainDatePreview;

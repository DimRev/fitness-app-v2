import { PopoverContent } from "@radix-ui/react-popover";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { H2 } from "~/features/shared/components/Typography";
import { Button } from "~/features/shared/components/ui/button";
import { Calendar } from "~/features/shared/components/ui/calendar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/features/shared/components/ui/card";
import {
  Popover,
  PopoverTrigger,
} from "~/features/shared/components/ui/popover";
import { Skeleton } from "~/features/shared/components/ui/skeleton";
import { cn } from "~/lib/utils";
import useGetConsumedMealsByMealID from "../hooks/useGetConsumedMealsByMealID";
import useToggleToggleConsumeMeal from "../hooks/useToggleConsumeMeal";
import { toast } from "sonner";

type Props = {
  mealWithNutrition: MealWithNutrition;
};

function MealPreview({ mealWithNutrition }: Props) {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const {
    data: consumedMeals,
    isLoading: isLoadingConsumedMeals,
    isError,
    error,
  } = useGetConsumedMealsByMealID({
    mealId: mealWithNutrition.meal.id,
  });

  const { mutateAsync: toggleConsumeMeal } = useToggleToggleConsumeMeal();

  const navigate = useNavigate();

  useEffect(() => {
    if (consumedMeals) {
      setSelectedDates(consumedMeals.map((meal) => new Date(meal.date)));
    }
  }, [consumedMeals]);

  function handleSelect(date: Date[] | undefined) {
    if (!date) return;
    const diffAdd = date.filter((d) => !selectedDates.includes(d)) ?? [];
    const diffRemove = selectedDates.filter((d) => !date.includes(d)) ?? [];
    const diff = [...diffAdd, ...diffRemove][0];
    diff.setDate(diff.getDate() + 1);

    console.log(diff);
    void toggleConsumeMeal(
      {
        meal_id: mealWithNutrition.meal.id,
        date: diff.toISOString(),
      },
      {
        onSuccess: (data) => {
          if (data.was_deleted) {
            toast.success("Successfully removed!", {
              dismissible: true,
              description: `Removed ${mealWithNutrition.meal.name} on ${date[0].toDateString()}`,
            });
          } else {
            toast.success("Successfully recorded!", {
              dismissible: true,
              description: `Consumed ${mealWithNutrition.meal.name} on ${date[0].toDateString()}`,
            });
          }

          setSelectedDates((p) => {
            if (p.includes(diff)) {
              return p.filter((d) => d !== diff);
            } else {
              return [...p, diff];
            }
          });

          setIsOpen(false);
        },
        onError: (err) => {
          toast.error("Failed to consume", {
            dismissible: true,
            description: `Error: ${err.message}`,
          });
        },
      },
    );

    // if (date.length > selectedDates.length) {
    //   const diff = date.filter((d) => !selectedDates.includes(d))[0];
    //   void consumeMeal(
    //     {
    //       meal_id: mealWithNutrition.meal.id,
    //       date: diff.toISOString().split("T")[0],
    //     },
    //     {
    //       onSuccess: () => {
    //         setSelectedDates([...selectedDates, diff]);
    //         toast.success("Successfully recorded!", {
    //           dismissible: true,
    //           description: `Consumed ${mealWithNutrition.meal.name} on ${diff.toDateString()}`,
    //         });
    //         setIsOpen(false);
    //       },
    //       onError: (err) => {
    //         toast.error("Failed to consume", {
    //           dismissible: true,
    //           description: `Error: ${err.message}`,
    //         });
    //       },
    //     },
    //   );
    // } else {
    //   const diff = selectedDates.filter((d) => !date.includes(d))[0];
    //   const id = consumedMeals?.find(
    //     (m) => m.date.split("T")[0] === diff.toISOString().split("T")[0],
    //   )?.id;

    //   void removeConsumedMeal(
    //     {
    //       id: id!,
    //       meal_id: mealWithNutrition.meal.id,
    //       date: diff.toISOString().split("T")[0],
    //     },
    //     {
    //       onSuccess: () => {
    //         setSelectedDates(selectedDates.filter((d) => d !== diff));
    //         toast.success("Successfully removed!", {
    //           dismissible: true,
    //           description: `Removed ${mealWithNutrition.meal.name} on ${diff.toDateString()}`,
    //         });
    //         setIsOpen(false);
    //       },
    //       onError: (err) => {
    //         toast.error("Failed to remove", {
    //           dismissible: true,
    //           description: `Error: ${err.message}`,
    //         });
    //       },
    //     },
    //   );
    // }
  }

  return (
    <Card>
      <CardHeader>
        <H2>{mealWithNutrition.meal.name}</H2>
      </CardHeader>
      <CardContent>
        <div className="gap-2 grid grid-cols-[3fr_2fr]">
          <div className="line-clamp-3 whitespace-pre-wrap">
            {mealWithNutrition.meal.description ?? "No description"}
          </div>
          <div className="truncate">
            <div className="flex justify-between items-center gap-2">
              <div>Calories:</div>
              <div>{mealWithNutrition.total_calories.toFixed(2)}</div>
            </div>
            <div className="flex justify-between items-center gap-2">
              <div>Fat:</div>
              <div>{mealWithNutrition.total_fat.toFixed(2)}</div>
            </div>
            <div className="flex justify-between items-center gap-2">
              <div>Carbs:</div>
              <div>{mealWithNutrition.total_carbs.toFixed(2)}</div>
            </div>
            <div className="flex justify-between items-center gap-2">
              <div>Protein:</div>
              <div>{mealWithNutrition.total_protein.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button
          onClick={() =>
            navigate(`/dashboard/meal/details/${mealWithNutrition.meal.id}`)
          }
        >
          Details
        </Button>
        <Button
          onClick={() =>
            navigate(`/dashboard/meal/edit/${mealWithNutrition.meal.id}`)
          }
        >
          Edit
        </Button>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button>Consume</Button>
          </PopoverTrigger>
          <PopoverContent className="z-10">
            <Card>
              <CardHeader>
                <H2>Record Meal</H2>
              </CardHeader>
              <CardContent>
                {isError && <div>{error.message}</div>}
                <Calendar
                  disabled={!isError && isLoadingConsumedMeals}
                  className={cn(
                    isLoadingConsumedMeals && "animate-pulse",
                    isError && "cursor-not-allowed",
                  )}
                  mode="multiple"
                  onSelect={handleSelect}
                  selected={selectedDates}
                />
              </CardContent>
              <CardFooter>
                {isError && (
                  <div className="font-extrabold text-destructive">
                    {error.message}
                  </div>
                )}
              </CardFooter>
            </Card>
          </PopoverContent>
        </Popover>
      </CardFooter>
    </Card>
  );
}

export function MealPreviewSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="w-full h-4" />
      </CardHeader>
      <CardContent>
        <div className="gap-2 grid grid-cols-[3fr_2fr]">
          <div className="flex flex-col gap-2">
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-full h-4" />
          </div>
          <div className="truncate">
            <div className="flex justify-between items-center gap-2">
              <div>Calories:</div>
              <div className="text-end">
                <Skeleton className="w-20 h-4" />
              </div>
            </div>
            <div className="flex justify-between items-center gap-2">
              <div>Fat:</div>
              <div className="text-end">
                <Skeleton className="w-20 h-4" />
              </div>
            </div>
            <div className="flex justify-between items-center gap-2">
              <div>Carbs:</div>
              <div className="text-end">
                <Skeleton className="w-20 h-4" />
              </div>
            </div>
            <div className="flex justify-between items-center gap-2">
              <div>Protein:</div>
              <div className="text-end">
                <Skeleton className="w-20 h-4" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function MealPreviewEmpty() {
  return (
    <Card className="opacity-50">
      <CardHeader>
        <H2>Empty</H2>
      </CardHeader>
      <CardContent>
        <div className="gap-2 grid grid-cols-[3fr_2fr]">
          <div>N/A</div>
          <div className="truncate">
            <div className="flex justify-between items-center gap-2">
              <div>Calories:</div>
              <div className="text-end">0.00</div>
            </div>
            <div className="flex justify-between items-center gap-2">
              <div>Fat:</div>
              <div className="text-end">0.00</div>
            </div>
            <div className="flex justify-between items-center gap-2">
              <div>Carbs:</div>
              <div className="text-end">0.00</div>
            </div>
            <div className="flex justify-between items-center gap-2">
              <div>Protein:</div>
              <div className="text-end">0.00</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default MealPreview;

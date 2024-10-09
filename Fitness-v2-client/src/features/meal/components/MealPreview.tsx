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
import useDeleteMeal from "../hooks/useDeleteMeal";
import useLayoutStore from "~/features/layout/hooks/useLayoutStore";

type Props = {
  mealWithNutrition: MealWithNutrition;
};

function MealPreview({ mealWithNutrition }: Props) {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { setIsConfirmationDialogOpen } = useLayoutStore();

  const {
    data: consumedMeals,
    isLoading: isLoadingConsumedMeals,
    isError,
    error,
  } = useGetConsumedMealsByMealID({
    mealId: mealWithNutrition.meal.id,
  });

  const { mutateAsync: toggleConsumeMeal } = useToggleToggleConsumeMeal();
  const { mutateAsync: deleteMeal } = useDeleteMeal();

  const navigate = useNavigate();

  useEffect(() => {
    if (consumedMeals) {
      const dates = consumedMeals.map((meal) => new Date(meal.date));
      setSelectedDates(dates);
    }
  }, [consumedMeals]);

  function handleSelect(date: Date | undefined) {
    if (!date) return;

    const thisDate = date.getTime() + 1000 * 60 * 60 * 24;
    void toggleConsumeMeal(
      {
        meal_id: mealWithNutrition.meal.id,
        date: new Date(thisDate),
      },
      {
        onSuccess: (data) => {
          if (data.was_deleted) {
            toast.success("Successfully removed!", {
              dismissible: true,
              description: `Removed ${mealWithNutrition.meal.name} on ${date.toDateString()}`,
            });
          } else {
            toast.success("Successfully recorded!", {
              dismissible: true,
              description: `Consumed ${mealWithNutrition.meal.name} on ${date.toDateString()}`,
            });
          }

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
  }

  function handleDelete(mealId: string) {
    setIsConfirmationDialogOpen(
      true,
      "Are you sure you want to delete this meal?",
      () => {
        void deleteMeal(
          {
            meal_id: mealId,
          },
          {
            onSuccess: () => {
              toast.success("Successfully deleted!", {
                dismissible: true,
                description: `Deleted ${mealWithNutrition.meal.name}`,
              });
            },
            onError: (err) => {
              toast.error("Failed to delete", {
                dismissible: true,
                description: `Error: ${err.message}`,
              });
            },
          },
        );
      },
    );
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
      <CardFooter className="flex flex-col gap-2 w-full">
        {isError && (
          <div className="font-extrabold text-destructive">{error.message}</div>
        )}
        <div className="flex justify-between w-full">
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
        </div>
        <div className="flex justify-between w-full">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button>Record</Button>
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
                    onDayClick={handleSelect}
                    selected={selectedDates}
                  />
                </CardContent>
              </Card>
            </PopoverContent>
          </Popover>
          <Button
            variant="destructive"
            onClick={() => handleDelete(mealWithNutrition.meal.id)}
          >
            Delete
          </Button>
        </div>
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
      <CardFooter className="flex flex-col gap-2 w-full">
        <div className="flex justify-between w-full">
          <Button disabled>Details</Button>
          <Button disabled>Edit</Button>
        </div>
        <div className="flex justify-between w-full">
          <Button disabled>Record</Button>
          <Button disabled variant="destructive">
            Delete
          </Button>
        </div>
      </CardFooter>
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
      <CardFooter className="flex flex-col gap-2 w-full">
        <div className="flex justify-between w-full">
          <Button disabled>Details</Button>
          <Button disabled>Edit</Button>
        </div>
        <div className="flex justify-between w-full">
          <Button disabled>Record</Button>
          <Button disabled variant="destructive">
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default MealPreview;

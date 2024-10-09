import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/features/shared/components/ui/card";
import useGetMealByID from "../hooks/useGetMealByID";
import { H2, H3 } from "~/features/shared/components/Typography";
import { Separator } from "~/features/shared/components/ui/separator";
import { Button } from "~/features/shared/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Textarea } from "~/features/shared/components/ui/textarea";
import { Apple } from "lucide-react";
import useGetConsumedMealsByMealID from "../hooks/useGetConsumedMealsByMealID";
import FoodItemBadge from "~/features/food_item/components/FoodItemBadge";
import useDeleteMeal from "../hooks/useDeleteMeal";
import { toast } from "sonner";
import { useEffect } from "react";
import useLayoutStore from "~/features/layout/hooks/useLayoutStore";

type Props = {
  mealId: string;
};

function MealDetails({ mealId }: Props) {
  const {
    data: mealWithNutritionAndFoodItems,
    isLoading,
    isError,
  } = useGetMealByID({
    mealId,
  });
  const { data: consumedMeals, isLoading: isLoadingConsumedMeals } =
    useGetConsumedMealsByMealID({
      mealId,
    });
  const { mutateAsync: deleteMeal } = useDeleteMeal();
  const { setIsConfirmationDialogOpen } = useLayoutStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (isError) {
      navigate("/dashboard/meal");
    }
  }, [isError, navigate]);

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
                description: `Deleted ${mealWithNutritionAndFoodItems?.meal.meal.name}`,
              });
              navigate("/dashboard/meal");
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

  if (isLoading || isLoadingConsumedMeals) {
    return <div>Loading...</div>;
  }

  if (!mealWithNutritionAndFoodItems || !consumedMeals) {
    return <div>No meal found</div>;
  }

  return (
    <Card>
      <CardHeader>
        <H2>{mealWithNutritionAndFoodItems?.meal.meal.name}</H2>
      </CardHeader>
      <CardContent>
        <Separator className="mb-2" />
        <div className="grid grid-cols-[3fr_2fr] gap-2">
          {/* <div className="border-e line-clamp-3 break-words"></div> */}
          <Textarea
            readOnly={true}
            value={
              mealWithNutritionAndFoodItems?.meal.meal.description ??
              "No description"
            }
            className="height-[100px] scroll resize-none"
          />
          <div className="truncate">
            <div className="flex items-center justify-between gap-2">
              <div>Total Calories:</div>
              <div>
                {mealWithNutritionAndFoodItems?.meal.total_calories.toFixed(2)}
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div>Total Fat:</div>
              <div>
                {mealWithNutritionAndFoodItems?.meal.total_fat.toFixed(2)}
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div>Total Carbs:</div>
              <div>
                {mealWithNutritionAndFoodItems?.meal.total_carbs.toFixed(2)}
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div>Total Protein:</div>
              <div>
                {mealWithNutritionAndFoodItems?.meal.total_protein.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
        <Separator className="mt-2" />
        <H2>Dates Consumed:</H2>
        <div className="flex flex-wrap gap-2">
          {consumedMeals.map((consumedMeal) => (
            <div
              key={consumedMeal.meal_id + consumedMeal.date}
              className="rounded-md border px-4 py-2"
            >
              <div>{new Date(consumedMeal.date).toDateString()}</div>
            </div>
          ))}
        </div>
        <Separator className="mt-2" />
        <H2>Food Items:</H2>
        <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
          {mealWithNutritionAndFoodItems?.food_items.map((foodItem) => (
            <Card key={foodItem.food_item.id} className="border-2 py-1">
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <H3>
                    {foodItem.food_item.name} x {foodItem.amount}
                  </H3>
                  <FoodItemBadge foodItemTypes={foodItem.food_item.food_type} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="flex h-56 items-center justify-center rounded-md border">
                    <div className="h-full w-full">
                      {foodItem.food_item.image_url ? (
                        <img
                          src={foodItem.food_item.image_url}
                          alt={foodItem.food_item.name}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <Apple className="h-full w-full object-contain opacity-55" />
                      )}
                    </div>
                  </div>
                  <div className="absolute inset-0 flex flex-col justify-between rounded-md border bg-black/70 p-1 text-foreground">
                    <div className="mt-2 line-clamp-4">
                      {foodItem.food_item.description ?? "No description"}
                    </div>
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <div>Calories:</div>
                        <div className="h-[1px] flex-1 bg-foreground"></div>
                        <div>{foodItem.food_item.calories}</div>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div>Carbs:</div>
                        <div className="h-[1px] flex-1 bg-foreground"></div>
                        <div>{foodItem.food_item.carbs}</div>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div>Fat:</div>
                        <div className="h-[1px] flex-1 bg-foreground"></div>
                        <div>{foodItem.food_item.fat}</div>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div>Protein:</div>
                        <div className="h-[1px] flex-1 bg-foreground"></div>
                        <div>{foodItem.food_item.protein}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button onClick={() => navigate(`/dashboard/meal/edit/${mealId}`)}>
          Edit
        </Button>
        <Button variant="destructive" onClick={() => handleDelete(mealId)}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default MealDetails;

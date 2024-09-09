import {
  Card,
  CardContent,
  CardHeader,
} from "~/features/shared/components/ui/card";
import useGetMealByID from "../hooks/useGetMealByID";
import { H2, H3 } from "~/features/shared/components/Typography";
import { Separator } from "~/features/shared/components/ui/separator";

type Props = {
  mealId: string;
};

function MealDetails({ mealId }: Props) {
  const { data: mealWithNutritionAndFoodItems, isLoading } = useGetMealByID({
    mealId,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!mealWithNutritionAndFoodItems) {
    return <div>No meal found</div>;
  }

  return (
    <Card>
      <CardHeader>
        <H2>{mealWithNutritionAndFoodItems?.meal.meal.name}</H2>
      </CardHeader>
      <CardContent>
        <Separator className="mb-2" />
        <div className="gap-2 grid grid-cols-[3fr_2fr]">
          <div className="border-e line-clamp-3 break-words">
            {mealWithNutritionAndFoodItems?.meal.meal.description ??
              "No description"}
          </div>
          <div className="truncate">
            <div className="flex justify-between items-center gap-2">
              <div>Total Calories:</div>
              <div>
                {mealWithNutritionAndFoodItems?.meal.total_calories.toFixed(2)}
              </div>
            </div>
            <div className="flex justify-between items-center gap-2">
              <div>Total Fat:</div>
              <div>
                {mealWithNutritionAndFoodItems?.meal.total_fat.toFixed(2)}
              </div>
            </div>
            <div className="flex justify-between items-center gap-2">
              <div>Total Carbs:</div>
              <div>
                {mealWithNutritionAndFoodItems?.meal.total_carbs.toFixed(2)}
              </div>
            </div>
            <div className="flex justify-between items-center gap-2">
              <div>Total Protein:</div>
              <div>
                {mealWithNutritionAndFoodItems?.meal.total_protein.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
        <Separator className="mt-2" />
        <H2>Food Items:</H2>
        <div className="gap-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-2">
          {mealWithNutritionAndFoodItems?.food_items.map((foodItem) => (
            <Card key={foodItem.food_item.id} className="border-2 px-2 py-1">
              <H3>
                {foodItem.food_item.name} x {foodItem.amount}
              </H3>
              <div>Calories: {foodItem.food_item.calories}</div>
              <div>Carbs: {foodItem.food_item.carbs}</div>
              <div>Fat: {foodItem.food_item.fat}</div>
              <div>Protein: {foodItem.food_item.protein}</div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default MealDetails;

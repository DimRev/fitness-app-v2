import { DashboardContentCards } from "~/features/shared/components/CustomCards";
import useGetMealsByUserID from "../hooks/useGetMealsByUserID";
import { Button } from "~/features/shared/components/ui/button";

function MealsList() {
  const {
    data: mealsWithNutrition,
    isLoading,
    isError,
  } = useGetMealsByUserID({
    limit: 10,
    offset: 0,
  });
  if (isLoading) {
    return (
      <DashboardContentCards title="Meals">Loading...</DashboardContentCards>
    );
  }
  if (isError) {
    return (
      <DashboardContentCards title="Meals">
        An error occurred
      </DashboardContentCards>
    );
  }
  if (!mealsWithNutrition) {
    return (
      <DashboardContentCards title="Meals">
        <div className="flex justify-end">
          <Button>Add Meal</Button>
        </div>
        No meals found
      </DashboardContentCards>
    );
  }
  return (
    <DashboardContentCards title="Meals">
      <div className="flex justify-end">
        <Button>Add Meal</Button>
      </div>
    </DashboardContentCards>
  );
}

export default MealsList;

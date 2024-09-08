import { Link } from "react-router-dom";
import { DashboardContentCards } from "~/features/shared/components/CustomCards";
import { buttonVariants } from "~/features/shared/components/ui/button";
import useGetMealsByUserID from "../hooks/useGetMealsByUserID";

function MealsList() {
  const {
    data: mealsWithNutrition,
    isLoading,
    isError,
  } = useGetMealsByUserID({
    limit: 10,
    offset: 0,
  });
  console.log(mealsWithNutrition);
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
          <Link className={buttonVariants()} to="/dashboard/meal/add">
            Add Meal
          </Link>
        </div>
        No meals found
      </DashboardContentCards>
    );
  }
  return (
    <DashboardContentCards title="Meals">
      <div className="flex justify-end">
        <Link className={buttonVariants()} to="/dashboard/meal/add">
          Add Meal
        </Link>
      </div>
    </DashboardContentCards>
  );
}

export default MealsList;

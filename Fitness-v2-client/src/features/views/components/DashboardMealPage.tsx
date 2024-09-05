import { Sandwich } from "lucide-react";
import MealsList from "~/features/meal/components/MealsList";
import DashboardPageWrapper from "./DashboardPageWrapper";

function DashboardMealPage() {
  return (
    <DashboardPageWrapper
      title="Meals"
      LucideIcon={Sandwich}
      to="/dashboard/meal"
      iconClasses="fill-orange-500 dark:fill-orange-700"
    >
      <MealsList />
    </DashboardPageWrapper>
  );
}

export default DashboardMealPage;

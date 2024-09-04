import { Sandwich } from "lucide-react";
import MealsList from "~/features/meal/components/MealsList";
import DashboardPageWrapper from "./DashboardPageWrapper";

function DashboardMealPage() {
  return (
    <DashboardPageWrapper
      title="Meals"
      LucideIcon={Sandwich}
      to="/dashboard/meal"
    >
      <MealsList />
    </DashboardPageWrapper>
  );
}

export default DashboardMealPage;

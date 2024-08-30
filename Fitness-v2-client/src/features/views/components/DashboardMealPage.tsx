import MealsList from "~/features/meal/components/MealsList";
import { PageHeader } from "~/features/shared/components/Typography";
import DashboardPageWrapper from "./DashboardPageWrapper";
import { Sandwich } from "lucide-react";

function DashboardMealPage() {
  return (
    <DashboardPageWrapper>
      <PageHeader to="/dashboard/meal" LucideIcon={Sandwich}>
        Meals
      </PageHeader>
      <MealsList />
    </DashboardPageWrapper>
  );
}

export default DashboardMealPage;

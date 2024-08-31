import { Plus } from "lucide-react";
import { PageHeader } from "~/features/shared/components/Typography";
import DashboardPageWrapper from "./DashboardPageWrapper";
import MealAddForm from "~/features/meal/components/MealAddForm";

function DashboardMealAddPage() {
  return (
    <DashboardPageWrapper>
      <PageHeader to="/dashboard/meal/add" LucideIcon={Plus}>
        Add Meal
      </PageHeader>
      <MealAddForm />
    </DashboardPageWrapper>
  );
}

export default DashboardMealAddPage;

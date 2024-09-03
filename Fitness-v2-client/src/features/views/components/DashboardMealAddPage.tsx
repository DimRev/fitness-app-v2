import { Plus } from "lucide-react";
import MealAddForm from "~/features/meal/components/MealAddForm";
import DashboardPageWrapper from "./DashboardPageWrapper";

function DashboardMealAddPage() {
  return (
    <DashboardPageWrapper title="Add Meal" LucideIcon={Plus} to="/dashboard">
      <MealAddForm />
    </DashboardPageWrapper>
  );
}

export default DashboardMealAddPage;

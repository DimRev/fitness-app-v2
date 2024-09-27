import { Plus } from "lucide-react";
import MealAddForm from "~/features/meal/components/MealAddForm";
import DashboardPageWrapper from "./DashboardPageWrapper";
import { Helmet } from "react-helmet";

function DashboardMealAddPage() {
  return (
    <>
      <Helmet>
        <title>Dashboard - Add Meal</title>
      </Helmet>
      <DashboardPageWrapper
        title="Add Meal"
        LucideIcon={Plus}
        to="/dashboard/meal/add"
      >
        <MealAddForm />
      </DashboardPageWrapper>
    </>
  );
}

export default DashboardMealAddPage;

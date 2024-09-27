import { Sandwich } from "lucide-react";
import MealsList from "~/features/meal/components/MealsList";
import DashboardPageWrapper from "./DashboardPageWrapper";
import { Helmet } from "react-helmet";

function DashboardMealPage() {
  return (
    <>
      <Helmet>
        <title>Dashboard - Meals</title>
      </Helmet>
      <DashboardPageWrapper
        title="Meals"
        LucideIcon={Sandwich}
        to="/dashboard/meal"
        iconClasses="fill-orange-500 dark:fill-orange-700"
      >
        <MealsList />
      </DashboardPageWrapper>
    </>
  );
}

export default DashboardMealPage;

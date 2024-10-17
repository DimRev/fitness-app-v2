import { Sandwich } from "lucide-react";
import { useParams } from "react-router-dom";
import MealDetails from "~/features/meal/components/MealDetails";
import DashboardPageWrapper from "./DashboardPageWrapper";
import { Helmet } from "react-helmet";

function DashboardMealDetailsPage() {
  const { mealId } = useParams();

  return (
    <>
      <Helmet>
        <title>Dashboard - Meal Details</title>
      </Helmet>
      <DashboardPageWrapper
        title="Meal Details"
        LucideIcon={Sandwich}
        to={`/dashboard/meal/${mealId}`}
        iconClasses="fill-orange-500 dark:fill-orange-700"
      >
        {mealId ? <MealDetails mealId={mealId} /> : <div>No meal id</div>}
      </DashboardPageWrapper>
    </>
  );
}

export default DashboardMealDetailsPage;

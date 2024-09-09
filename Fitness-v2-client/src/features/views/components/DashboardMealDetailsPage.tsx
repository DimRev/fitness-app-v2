import { Sandwich } from "lucide-react";
import { useParams } from "react-router-dom";
import MealDetails from "~/features/meal/components/MealDetails";
import DashboardPageWrapper from "./DashboardPageWrapper";

function DashboardMealDetailsPage() {
  const { mealId } = useParams();

  return (
    <DashboardPageWrapper
      title="Add Meal"
      LucideIcon={Sandwich}
      to={`/dashboard/meal/details`}
    >
      {mealId ? <MealDetails mealId={mealId} /> : <div>No meal id</div>}
    </DashboardPageWrapper>
  );
}

export default DashboardMealDetailsPage;

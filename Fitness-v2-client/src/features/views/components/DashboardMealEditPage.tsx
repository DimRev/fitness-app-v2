import { Edit } from "lucide-react";
import { useParams } from "react-router-dom";
import MealEditForm from "~/features/meal/components/MealEditForm";
import DashboardPageWrapper from "./DashboardPageWrapper";
import { Helmet } from "react-helmet";

function DashboardMealEditPage() {
  const { mealId } = useParams();

  return (
    <>
      <Helmet>
        <title>Dashboard - Edit Meal</title>
      </Helmet>
      <DashboardPageWrapper
        title="Edit Meal"
        LucideIcon={Edit}
        to="/dashboard/meal/edit"
      >
        {mealId ? <MealEditForm mealId={mealId} /> : <div>No meal id</div>}
      </DashboardPageWrapper>
    </>
  );
}

export default DashboardMealEditPage;

import { Plus } from "lucide-react";
import DashboardPageWrapper from "./DashboardPageWrapper";
import FoodItemPendingAddForm from "~/features/food_item_pending/components/FoodItemPendingAddForm";
import { Helmet } from "react-helmet";

function DashboardFoodItemPendingAddPage() {
  return (
    <>
      <Helmet>
        <title>Dashboard - Add Food Items</title>
      </Helmet>
      <DashboardPageWrapper
        title="Add Food Items"
        LucideIcon={Plus}
        to="/dashboard/food_item/add"
      >
        <FoodItemPendingAddForm />
      </DashboardPageWrapper>
    </>
  );
}

export default DashboardFoodItemPendingAddPage;

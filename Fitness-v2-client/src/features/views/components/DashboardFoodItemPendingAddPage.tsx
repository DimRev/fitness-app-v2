import { Plus } from "lucide-react";
import DashboardPageWrapper from "./DashboardPageWrapper";
import FoodItemPendingForm from "~/features/food_item_pending/components/FoodItemPendingForm";

function DashboardFoodItemPendingAddPage() {
  return (
    <DashboardPageWrapper
      title="Add Food Items"
      LucideIcon={Plus}
      to="/dashboard/food_item/add"
    >
      <FoodItemPendingForm />
    </DashboardPageWrapper>
  );
}

export default DashboardFoodItemPendingAddPage;

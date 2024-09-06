import { Plus } from "lucide-react";
import DashboardPageWrapper from "./DashboardPageWrapper";
import FoodItemPendingAddForm from "~/features/food_item_pending/components/FoodItemPendingAddForm";

function DashboardFoodItemPendingAddPage() {
  return (
    <DashboardPageWrapper
      title="Add Food Items"
      LucideIcon={Plus}
      to="/dashboard/food_item/add"
    >
      <FoodItemPendingAddForm />
    </DashboardPageWrapper>
  );
}

export default DashboardFoodItemPendingAddPage;

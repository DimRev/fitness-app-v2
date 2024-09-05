import { Apple } from "lucide-react";
import FoodItemsPendingList from "~/features/food_item_pending/components/FoodItemsPendingList";
import DashboardPageWrapper from "./DashboardPageWrapper";

function DashboardFoodItemPendingPage() {
  return (
    <DashboardPageWrapper
      title="Food Items"
      LucideIcon={Apple}
      to="/dashboard/food_item"
      iconClasses="fill-green-500 dark:fill-green-700"
    >
      <FoodItemsPendingList />
    </DashboardPageWrapper>
  );
}

export default DashboardFoodItemPendingPage;

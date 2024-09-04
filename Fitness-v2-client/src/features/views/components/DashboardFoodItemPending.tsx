import { Apple } from "lucide-react";
import FoodItemsPendingList from "~/features/food_item_pending/components/FoodItemsPendingList";
import DashboardPageWrapper from "./DashboardPageWrapper";

function DashboardFoodItemPending() {
  return (
    <DashboardPageWrapper title="Food Items" LucideIcon={Apple} to="/dashboard">
      <FoodItemsPendingList />
    </DashboardPageWrapper>
  );
}

export default DashboardFoodItemPending;

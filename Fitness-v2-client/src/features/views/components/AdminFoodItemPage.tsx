import { Apple } from "lucide-react";
import FoodItemsPendingList from "~/features/food_item_pending/components/FoodItemsPendingList";
import DashboardPageWrapper from "./DashboardPageWrapper";

function AdminFoodItemPage() {
  return (
    <DashboardPageWrapper title="Food Items" LucideIcon={Apple} to="/admin">
      <FoodItemsPendingList />
    </DashboardPageWrapper>
  );
}

export default AdminFoodItemPage;

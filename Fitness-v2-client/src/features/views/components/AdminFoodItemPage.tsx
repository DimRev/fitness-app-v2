import { Apple } from "lucide-react";
import FoodItemsPendingAdminTable from "~/features/food_item_pending/components/FoodItemsPendingAdminTable";
import DashboardPageWrapper from "./DashboardPageWrapper";

function AdminFoodItemPage() {
  return (
    <DashboardPageWrapper title="Food Items" LucideIcon={Apple} to="/admin">
      <FoodItemsPendingAdminTable />
    </DashboardPageWrapper>
  );
}

export default AdminFoodItemPage;

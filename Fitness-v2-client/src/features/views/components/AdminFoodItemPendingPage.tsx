import { Apple } from "lucide-react";
import FoodItemsPendingAdminTable from "~/features/food_item_pending/components/FoodItemsPendingAdminTable";
import DashboardPageWrapper from "./DashboardPageWrapper";

function AdminFoodItemPendingPage() {
  return (
    <DashboardPageWrapper
      title="Food Items Pending"
      LucideIcon={Apple}
      iconClasses="fill-green-500 dark:fill-green-600"
      to="/admin/food_item_pending"
    >
      <FoodItemsPendingAdminTable />
    </DashboardPageWrapper>
  );
}

export default AdminFoodItemPendingPage;

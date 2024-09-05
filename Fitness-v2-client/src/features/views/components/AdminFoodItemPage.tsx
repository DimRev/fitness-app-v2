import { Apple } from "lucide-react";
import FoodItemsPendingAdminTable from "~/features/food_item_pending/components/FoodItemsPendingAdminTable";
import DashboardPageWrapper from "./DashboardPageWrapper";

function AdminFoodItemPage() {
  return (
    <DashboardPageWrapper
      title="Food Items"
      LucideIcon={Apple}
      iconClasses="fill-green-500 dark:fill-green-600"
      to="/admin/food_item"
    >
      <FoodItemsPendingAdminTable />
    </DashboardPageWrapper>
  );
}

export default AdminFoodItemPage;

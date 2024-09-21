import { Apple } from "lucide-react";
import DashboardPageWrapper from "./DashboardPageWrapper";
import FoodItemsAdminTable from "~/features/food_item/components/FoodItemsAdminTable";

function AdminFoodItemPage() {
  return (
    <DashboardPageWrapper
      title="Food Items"
      LucideIcon={Apple}
      iconClasses="fill-green-500 dark:fill-green-600"
      to="/admin/food_item"
    >
      <FoodItemsAdminTable />
    </DashboardPageWrapper>
  );
}

export default AdminFoodItemPage;

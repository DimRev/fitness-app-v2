import { Apple } from "lucide-react";
import DashboardPageWrapper from "./DashboardPageWrapper";

function AdminFoodItemPage() {
  return (
    <DashboardPageWrapper
      title="Food Items"
      LucideIcon={Apple}
      iconClasses="fill-green-500 dark:fill-green-600"
      to="/admin/food_item"
    >
      Food Items Page
    </DashboardPageWrapper>
  );
}

export default AdminFoodItemPage;

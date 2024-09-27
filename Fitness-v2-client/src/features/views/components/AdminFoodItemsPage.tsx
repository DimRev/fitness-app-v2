import { Apple } from "lucide-react";
import DashboardPageWrapper from "./DashboardPageWrapper";
import FoodItemsAdminTable from "~/features/food_item/components/FoodItemsAdminTable";
import { Helmet } from "react-helmet";

function AdminFoodItemPage() {
  return (
    <>
      <Helmet>
        <title>Admin - Food Items</title>
      </Helmet>
      <DashboardPageWrapper
        title="Food Items"
        LucideIcon={Apple}
        iconClasses="fill-green-500 dark:fill-green-600"
        to="/admin/food_item"
      >
        <FoodItemsAdminTable />
      </DashboardPageWrapper>
    </>
  );
}

export default AdminFoodItemPage;

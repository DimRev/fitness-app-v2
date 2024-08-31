import { Apple } from "lucide-react";
import FoodItemsList from "~/features/food_item/components/FoodItemsList";
import { PageHeader } from "~/features/shared/components/Typography";
import DashboardPageWrapper from "./DashboardPageWrapper";

function AdminFoodItemPage() {
  return (
    <DashboardPageWrapper>
      <PageHeader to="/admin/food_item" LucideIcon={Apple}>
        Food Items
      </PageHeader>
      <FoodItemsList />
    </DashboardPageWrapper>
  );
}

export default AdminFoodItemPage;

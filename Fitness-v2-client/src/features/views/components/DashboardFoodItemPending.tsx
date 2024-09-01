import { Apple } from "lucide-react";
import FoodItemsPendingList from "~/features/food_item_pending/components/FoodItemsPendingList";
import { PageHeader } from "~/features/shared/components/Typography";
import DashboardPageWrapper from "./DashboardPageWrapper";

function DashboardFoodItemPending() {
  return (
    <DashboardPageWrapper>
      <PageHeader to="/dashboard/food_item" LucideIcon={Apple}>
        Food Items
      </PageHeader>
      <FoodItemsPendingList />
    </DashboardPageWrapper>
  );
}

export default DashboardFoodItemPending;

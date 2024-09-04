import { Plus } from "lucide-react";
import FoodItemAddForm from "~/features/food_item/components/FoodItemAddForm";
import { PageHeader } from "~/features/shared/components/Typography";
import DashboardPageWrapper from "./DashboardPageWrapper";

function AdminFoodItemAddPage() {
  return (
    <DashboardPageWrapper>
      <PageHeader to="/admin/food_item/add" LucideIcon={Plus}>
        Add Food Item
      </PageHeader>
      <FoodItemAddForm />
    </DashboardPageWrapper>
  );
}

export default AdminFoodItemAddPage;

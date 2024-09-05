import { Plus } from "lucide-react";
import FoodItemAddForm from "~/features/food_item/components/FoodItemAddForm";
import DashboardPageWrapper from "./DashboardPageWrapper";

function AdminFoodItemAddPage() {
  return (
    <DashboardPageWrapper
      title="Add Food Item"
      LucideIcon={Plus}
      to="/admin/food_item/add"
      iconClasses="fill-green-500 dark:fill-green-600"
    >
      <FoodItemAddForm />
    </DashboardPageWrapper>
  );
}

export default AdminFoodItemAddPage;

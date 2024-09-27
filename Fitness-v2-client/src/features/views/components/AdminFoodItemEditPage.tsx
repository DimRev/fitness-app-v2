import { Edit } from "lucide-react";
import { useParams } from "react-router-dom";
import DashboardPageWrapper from "./DashboardPageWrapper";
import useGetFoodItemsByID from "~/features/food_item/hooks/useGetFoodItemByID";
import FoodItemEditForm from "~/features/food_item/components/FoodItemEditForm";
import { Helmet } from "react-helmet";

function AdminFoodItemEditPage() {
  const { foodItemId } = useParams();

  const { data: foodItem } = useGetFoodItemsByID({
    food_item_id: foodItemId!,
  });

  console.log(foodItem);

  return (
    <>
      <Helmet>
        <title>Admin - Edit Food Items</title>
      </Helmet>
      <DashboardPageWrapper
        title="Edit Food Items"
        LucideIcon={Edit}
        to="/admin/food_item/edit"
      >
        {foodItemId ? <FoodItemEditForm foodItemId={foodItemId} /> : null}
      </DashboardPageWrapper>
    </>
  );
}

export default AdminFoodItemEditPage;

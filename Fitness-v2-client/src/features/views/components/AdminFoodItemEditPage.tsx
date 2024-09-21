import { Edit } from "lucide-react";
import { useParams } from "react-router-dom";
import DashboardPageWrapper from "./DashboardPageWrapper";
import useGetFoodItemsByID from "~/features/food_item/hooks/useGetFoodItemByID";

function AdminFoodItemEditPage() {
  const { foodItemId } = useParams();

  const { data: foodItem } = useGetFoodItemsByID({
    food_item_id: foodItemId!,
  });

  console.log(foodItem);

  return (
    <DashboardPageWrapper
      title="Edit Food Items"
      LucideIcon={Edit}
      to="/admin/food_item/edit"
    >
      {foodItemId ? <div>{foodItemId}</div> : <div>No meal id</div>}
    </DashboardPageWrapper>
  );
}

export default AdminFoodItemEditPage;

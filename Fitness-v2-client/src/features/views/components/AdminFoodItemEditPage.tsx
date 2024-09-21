import { Edit } from "lucide-react";
import { useParams } from "react-router-dom";
import DashboardPageWrapper from "./DashboardPageWrapper";

function AdminFoodItemEditPage() {
  const { foodItemId } = useParams();

  return (
    <DashboardPageWrapper
      title="Food Items Edit"
      LucideIcon={Edit}
      to="/admin/food_item/edit"
    >
      {foodItemId ? <div>{foodItemId}</div> : <div>No meal id</div>}
    </DashboardPageWrapper>
  );
}

export default AdminFoodItemEditPage;

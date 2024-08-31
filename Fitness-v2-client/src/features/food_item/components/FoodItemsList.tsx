import { Link } from "react-router-dom";
import { DashboardContentCards } from "~/features/shared/components/CustomCards";
import { buttonVariants } from "~/features/shared/components/ui/button";

function FoodItemsList() {
  return (
    <DashboardContentCards title="Food Items">
      <div className="flex justify-end">
        <Link className={buttonVariants()} to="/admin/food_item/add">
          Add Food Item
        </Link>
      </div>
    </DashboardContentCards>
  );
}

export default FoodItemsList;

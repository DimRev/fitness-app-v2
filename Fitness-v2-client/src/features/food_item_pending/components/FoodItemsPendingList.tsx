import { XCircleIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { DashboardContentCards } from "~/features/shared/components/CustomCards";
import { buttonVariants } from "~/features/shared/components/ui/button";
import { ScrollArea } from "~/features/shared/components/ui/scroll-area";
import useGetFoodItemsPending from "../hooks/useGetFoodItemsPending";
import useToggleFoodItemPending from "../hooks/useToggleFoodItemPending";
import FoodItemPendingPreview, {
  FoodItemPendingPreviewSkeleton,
} from "./FoodItemPendingPreview";

function FoodItemsPendingList() {
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const {
    data: foodItemsPending,
    isLoading: foodItemsPendingLoading,
    isError: foodItemsPendingError,
  } = useGetFoodItemsPending({
    limit,
    offset,
  });
  const { mutateAsync: toggleFoodItemPending } = useToggleFoodItemPending();

  function handleToggleFoodItemPending(foodItemPendingId: string) {
    void toggleFoodItemPending({
      food_item_pending_id: foodItemPendingId,
      limit,
      offset,
    });
  }

  if (foodItemsPendingLoading) {
    return (
      <DashboardContentCards title="Food Items">
        <div className="flex justify-end">
          <Link className={buttonVariants()} to="/dashboard/food_item/add">
            Add Food Item
          </Link>
        </div>
        <div className="gap-3 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-2">
          <FoodItemPendingPreviewSkeleton />
          <FoodItemPendingPreviewSkeleton />
          <FoodItemPendingPreviewSkeleton />
          <FoodItemPendingPreviewSkeleton />
          <FoodItemPendingPreviewSkeleton />
          <FoodItemPendingPreviewSkeleton />
        </div>
      </DashboardContentCards>
    );
  }

  if (foodItemsPendingError || !foodItemsPending) {
    return (
      <DashboardContentCards title="Food Items">
        <div className="flex justify-end">
          <Link className={buttonVariants()} to="/dashboard/food_item/add">
            Add Food Item
          </Link>
        </div>

        <div className="mt-2 font-bold text-center text-destructive text-lg">
          <span className="flex justify-center items-center gap-2">
            <XCircleIcon /> An Error Has Occurred
          </span>
        </div>
      </DashboardContentCards>
    );
  }

  return (
    <DashboardContentCards title="Food Items">
      <div className="flex justify-end">
        <Link className={buttonVariants()} to="/dashboard/food_item/add">
          Add Food Item
        </Link>
      </div>
      <ScrollArea className="flex-1">
        <div className="gap-3 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-2">
          {foodItemsPending.map((foodItemPending) => (
            <FoodItemPendingPreview
              key={foodItemPending.id}
              foodItemPending={foodItemPending}
              handleToggleFoodItemPending={handleToggleFoodItemPending}
            />
          ))}
        </div>
      </ScrollArea>
    </DashboardContentCards>
  );
}

export default FoodItemsPendingList;

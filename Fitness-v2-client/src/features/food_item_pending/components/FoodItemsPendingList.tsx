import { ChevronLeft, ChevronRight, XCircleIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { DashboardContentCards } from "~/features/shared/components/CustomCards";
import { Button, buttonVariants } from "~/features/shared/components/ui/button";
import useGetFoodItemsPending from "../hooks/useGetFoodItemsPending";
import useToggleFoodItemPending from "../hooks/useToggleFoodItemPending";
import FoodItemPendingPreview, {
  FoodItemPendingPreviewSkeleton,
} from "./FoodItemPendingPreview";
import { Input } from "~/features/shared/components/ui/input";

function FoodItemsPendingList() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const offset = useMemo(() => page * pageSize - pageSize, [page, pageSize]);
  const {
    data: foodItemsPending,
    isLoading: foodItemsPendingLoading,
    isError: foodItemsPendingError,
  } = useGetFoodItemsPending({
    limit: pageSize,
    offset,
  });
  const { mutateAsync: toggleFoodItemPending } = useToggleFoodItemPending();

  function handleToggleFoodItemPending(foodItemPendingId: string) {
    void toggleFoodItemPending({
      food_item_pending_id: foodItemPendingId,
      limit: pageSize,
      offset,
    });
  }

  function onChangePage(type: "next" | "prev") {
    if (
      type === "next" &&
      foodItemsPending?.total_pages &&
      page < foodItemsPending.total_pages
    ) {
      setPage((prev) => prev + 1);
    }
    if (type === "prev" && foodItemsPending?.total_pages && page > 1) {
      setPage((prev) => prev - 1);
    }
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

  if (foodItemsPendingError || !foodItemsPending?.food_items_pending) {
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
      <div className="flex justify-end gap-2">
        <Input placeholder="Search..." />
        <Link className={buttonVariants()} to="/dashboard/food_item/add">
          Add Food Item
        </Link>
      </div>
      <div className="gap-3 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-2">
        {foodItemsPending.food_items_pending.map((foodItemPending) => (
          <FoodItemPendingPreview
            key={foodItemPending.id}
            foodItemPending={foodItemPending}
            handleToggleFoodItemPending={handleToggleFoodItemPending}
          />
        ))}
      </div>
      <div className="flex items-center gap-2 py-2">
        <Button
          size="icon"
          variant="ghost"
          disabled={page === 1}
          onClick={() => onChangePage("prev")}
        >
          <ChevronLeft />
        </Button>
        <div>
          <span>{page}</span>
          <span>
            {foodItemsPending.total_pages
              ? ` / ${foodItemsPending.total_pages}`
              : " / 1"}
          </span>
        </div>
        <Button
          size="icon"
          variant="ghost"
          disabled={
            page === foodItemsPending.total_pages ||
            !!foodItemsPending?.total_pages
          }
          onClick={() => onChangePage("next")}
        >
          <ChevronRight />
        </Button>
      </div>
    </DashboardContentCards>
  );
}

export default FoodItemsPendingList;

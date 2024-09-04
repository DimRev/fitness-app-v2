import { useMemo, useState } from "react";
import { DashboardContentCards } from "~/features/shared/components/CustomCards";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "~/features/shared/components/ui/table";
import useGetFoodItemsPending from "../hooks/useGetFoodItemsPending";
import useToggleFoodItemPending from "../hooks/useToggleFoodItemPending";
import { FoodItemPaginationButtons } from "./FoodItemPaginationButtons";
import FoodItemPendingAdminTableRow, {
  FoodItemPendingAdminTableRowEmpty,
  FoodItemPendingAdminTableRowSkeleton,
} from "./FoodItemPendingAdminTableRow";

function FoodItemsPendingAdminTable() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
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
      <DashboardContentCards title="Pending Food Items"></DashboardContentCards>
    );
  }

  if (foodItemsPendingError || !foodItemsPending?.food_items_pending) {
    return (
      <DashboardContentCards title="Pending Food Items">
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="truncate">Name</TableHead>
                <TableHead className="truncate">Description</TableHead>
                <TableHead className="truncate">Food Type</TableHead>
                <TableHead className="truncate">Calories</TableHead>
                <TableHead className="truncate">Fat</TableHead>
                <TableHead className="truncate">Protein</TableHead>
                <TableHead className="truncate">Carbs</TableHead>
                <TableHead className="truncate">Likes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <FoodItemPendingAdminTableRowSkeleton />
              <FoodItemPendingAdminTableRowSkeleton />
              <FoodItemPendingAdminTableRowSkeleton />
              <FoodItemPendingAdminTableRowSkeleton />
              <FoodItemPendingAdminTableRowSkeleton />
              <FoodItemPendingAdminTableRowSkeleton />
              <FoodItemPendingAdminTableRowSkeleton />
              <FoodItemPendingAdminTableRowSkeleton />
              <FoodItemPendingAdminTableRowSkeleton />
              <FoodItemPendingAdminTableRowSkeleton />
            </TableBody>
          </Table>
        </div>
        <FoodItemPaginationButtons
          page={page}
          onChangePage={onChangePage}
          foodItemsPending={foodItemsPending}
        />
      </DashboardContentCards>
    );
  }

  return (
    <DashboardContentCards title="Pending Food Items">
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="truncate">Name</TableHead>
              <TableHead className="truncate">Description</TableHead>
              <TableHead className="truncate">Food Type</TableHead>
              <TableHead className="truncate">Calories</TableHead>
              <TableHead className="truncate">Fat</TableHead>
              <TableHead className="truncate">Protein</TableHead>
              <TableHead className="truncate">Carbs</TableHead>
              <TableHead className="truncate">Likes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {foodItemsPending.food_items_pending.map((foodItemPending) => (
              <FoodItemPendingAdminTableRow
                key={foodItemPending.id}
                foodItemPending={foodItemPending}
              />
            ))}
            {new Array(
              pageSize - foodItemsPending.food_items_pending.length,
            ).fill(<FoodItemPendingAdminTableRowEmpty />)}
          </TableBody>
        </Table>
      </div>
      <FoodItemPaginationButtons
        page={page}
        onChangePage={onChangePage}
        foodItemsPending={foodItemsPending}
      />
    </DashboardContentCards>
  );
}

export default FoodItemsPendingAdminTable;

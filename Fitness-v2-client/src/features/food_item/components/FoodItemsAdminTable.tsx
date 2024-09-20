import { useMemo, useState } from "react";
import { DashboardContentCards } from "~/features/shared/components/CustomCards";
import ListPaginationButtons from "~/features/shared/components/ListPaginationButtons";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "~/features/shared/components/ui/table";
import useGetFoodItems from "../hooks/useGetFoodItems";
import FoodItemAdminTableRow from "./FoodItemAdminTableRow";

function FoodItemsAdminTable() {
  const [page, setPage] = useState(1);
  // TODO: Make dynamic page size changes
  const [pageSize] = useState(8);
  const [pendingIds, setPendingIds] = useState<string[]>([]);
  const offset = useMemo(() => page * pageSize - pageSize, [page, pageSize]);
  const {
    data: foodItems,
    isLoading: foodItemsLoading,
    isError: isFoodItemsError,
    error: foodItemsError,
  } = useGetFoodItems({
    limit: pageSize,
    offset,
  });

  function onChangePage(type: "next" | "prev") {
    if (
      type === "next" &&
      foodItems?.total_pages &&
      page < foodItems.total_pages
    ) {
      setPage((prev) => prev + 1);
    }
    if (type === "prev" && foodItems?.total_pages && page > 1) {
      setPage((prev) => prev - 1);
    }
  }

  if (foodItemsLoading) {
    return <div> Loading...</div>;
  }

  if (isFoodItemsError || !foodItems?.food_items) {
    return <div> Error loading food items, {foodItemsError?.message}</div>;
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
              <TableHead className="truncate">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {foodItems.food_items.map((foodItem) => (
              <FoodItemAdminTableRow
                isPending={pendingIds.includes(foodItem.id)}
                key={foodItem.id}
                foodItem={foodItem}
              />
            ))}
            {/* {foodItemsPending.food_items_pending.map((foodItemPending) => (
              <FoodItemPendingAdminTableRow
                isPending={pendingIds.includes(foodItemPending.id)}
                key={foodItemPending.id}
                foodItemPending={foodItemPending}
                handleApproveFoodItemPending={handleApproveFoodItemPending}
                handleRejectFoodItemPending={handleRejectFoodItemPending}
              />
            ))} */}
            {/* {new Array(pageSize - foodItemsPending.food_items_pending.length)
              .fill(null)
              .map((_, i) => (
                <FoodItemPendingAdminTableRowEmpty key={`empty-${i}`} />
              ))} */}
          </TableBody>
        </Table>
      </div>
      <ListPaginationButtons
        page={page}
        onChangePage={onChangePage}
        totalPages={foodItems?.total_pages}
      />
    </DashboardContentCards>
  );
}

export default FoodItemsAdminTable;

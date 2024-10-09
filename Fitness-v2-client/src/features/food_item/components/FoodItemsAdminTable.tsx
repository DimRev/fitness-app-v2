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
import FoodItemAdminTableRow, {
  FoodItemAdminTableRowEmpty,
  FoodItemAdminTableRowSkeleton,
} from "./FoodItemAdminTableRow";
import useDeleteFoodItem from "../hooks/useDeleteFoodItem";
import { toast } from "sonner";

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
  const { mutateAsync: deleteFoodItem } = useDeleteFoodItem();

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

  function handleDeleteFoodItem(foodItemId: string) {
    setPendingIds((prev) => [...prev, foodItemId]);
    void deleteFoodItem(
      {
        food_item_id: foodItemId,
      },
      {
        onSuccess: (data) => {
          toast.success("Successfully deleted food item", {
            dismissible: true,
            description: `Deleted: ${data.message}`,
          });
        },
        onError: (err) => {
          toast.error("Failed to delete food item", {
            dismissible: true,
            description: `Error: ${err.message}`,
          });
        },
        onSettled: () => {
          setPendingIds((prev) => prev.filter((id) => id !== foodItemId));
        },
      },
    );
  }

  if (foodItemsLoading) {
    return (
      <DashboardContentCards title="Pending Food Items">
        <div className="rounded-md border">
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
              <FoodItemAdminTableRowSkeleton />
              <FoodItemAdminTableRowSkeleton />
              <FoodItemAdminTableRowSkeleton />
              <FoodItemAdminTableRowSkeleton />
              <FoodItemAdminTableRowSkeleton />
              <FoodItemAdminTableRowSkeleton />
              <FoodItemAdminTableRowSkeleton />
              <FoodItemAdminTableRowSkeleton />
            </TableBody>
          </Table>
        </div>
        <ListPaginationButtons
          page={page}
          onChangePage={onChangePage}
          totalPages={foodItems}
        />
      </DashboardContentCards>
    );
  }

  if (isFoodItemsError || !foodItems?.food_items) {
    return <div> Error loading food items, {foodItemsError?.message}</div>;
  }

  return (
    <DashboardContentCards title="Pending Food Items">
      <div className="rounded-md border">
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
                key={foodItem.id}
                handleDeleteFoodItem={handleDeleteFoodItem}
                isPending={pendingIds.includes(foodItem.id)}
                foodItem={foodItem}
              />
            ))}
            {new Array(pageSize - foodItems.food_items.length)
              .fill(null)
              .map((_, i) => (
                <FoodItemAdminTableRowEmpty key={`empty-${i}`} />
              ))}
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

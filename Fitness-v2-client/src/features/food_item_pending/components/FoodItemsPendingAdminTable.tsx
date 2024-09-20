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
import useApproveFoodItemPending from "../hooks/useApproveFoodItemPending";
import useGetFoodItemsPending from "../hooks/useGetFoodItemsPending";
import useRejectFoodItemPending from "../hooks/useRejectFoodItemPending";
import FoodItemPendingAdminTableRow, {
  FoodItemPendingAdminTableRowEmpty,
  FoodItemPendingAdminTableRowSkeleton,
} from "./FoodItemPendingAdminTableRow";
import { toast } from "sonner";

function FoodItemsPendingAdminTable() {
  const [page, setPage] = useState(1);
  // TODO: Make dynamic page size changes
  const [pageSize] = useState(8);
  const [pendingIds, setPendingIds] = useState<string[]>([]);
  const offset = useMemo(() => page * pageSize - pageSize, [page, pageSize]);
  const {
    data: foodItemsPending,
    isLoading: foodItemsPendingLoading,
    isError: isFoodItemsPendingError,
    error: foodItemsPendingError,
  } = useGetFoodItemsPending({
    limit: pageSize,
    offset,
  });

  const { mutateAsync: approveFoodItemPending } = useApproveFoodItemPending();
  const { mutateAsync: rejectFoodItemPending } = useRejectFoodItemPending();

  function handleApproveFoodItemPending(foodItemPendingId: string) {
    setPendingIds((prev) => [...prev, foodItemPendingId]);
    void approveFoodItemPending(
      {
        food_item_pending_id: foodItemPendingId,
        limit: pageSize,
        offset,
      },
      {
        onSuccess: (data) => {
          toast.success("Successfully approved food item", {
            dismissible: true,
            description: `Approved: ${data.message}`,
          });
        },
        onError: (err) => {
          toast.error("Failed to approve food item", {
            dismissible: true,
            description: `Error: ${err.message}`,
          });
        },
        onSettled: () => {
          setPendingIds((prev) =>
            prev.filter((id) => id !== foodItemPendingId),
          );
        },
      },
    );
  }

  function handleRejectFoodItemPending(foodItemPendingId: string) {
    setPendingIds((prev) => [...prev, foodItemPendingId]);
    void rejectFoodItemPending(
      {
        food_item_pending_id: foodItemPendingId,
        limit: pageSize,
        offset,
      },
      {
        onSuccess: (data) => {
          toast.success("Successfully approved food item", {
            dismissible: true,
            description: `Rejected: ${data.message}`,
          });
        },
        onError: (err) => {
          toast.error("Failed to reject food item", {
            dismissible: true,
            description: `Error: ${err.message}`,
          });
        },
        onSettled: () => {
          setPendingIds((prev) =>
            prev.filter((id) => id !== foodItemPendingId),
          );
        },
      },
    );
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
                <TableHead className="truncate">Actions</TableHead>
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
            </TableBody>
          </Table>
        </div>
        <ListPaginationButtons
          page={page}
          onChangePage={onChangePage}
          totalPages={foodItemsPending}
        />
      </DashboardContentCards>
    );
  }

  if (isFoodItemsPendingError || !foodItemsPending?.food_items_pending) {
    return (
      <DashboardContentCards title="Pending Food Items">
        {foodItemsPendingError?.message}
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
              <TableHead className="truncate">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {foodItemsPending.food_items_pending.map((foodItemPending) => (
              <FoodItemPendingAdminTableRow
                isPending={pendingIds.includes(foodItemPending.id)}
                key={foodItemPending.id}
                foodItemPending={foodItemPending}
                handleApproveFoodItemPending={handleApproveFoodItemPending}
                handleRejectFoodItemPending={handleRejectFoodItemPending}
              />
            ))}
            {new Array(pageSize - foodItemsPending.food_items_pending.length)
              .fill(null)
              .map((_, i) => (
                <FoodItemPendingAdminTableRowEmpty key={`empty-${i}`} />
              ))}
          </TableBody>
        </Table>
      </div>
      <ListPaginationButtons
        page={page}
        onChangePage={onChangePage}
        totalPages={foodItemsPending?.total_pages}
      />
    </DashboardContentCards>
  );
}

export default FoodItemsPendingAdminTable;

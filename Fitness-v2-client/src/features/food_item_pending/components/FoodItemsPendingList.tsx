import { XCircleIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { DashboardContentCards } from "~/features/shared/components/CustomCards";
import ListPaginationButtons from "~/features/shared/components/ListPaginationButtons";
import { buttonVariants } from "~/features/shared/components/ui/button";
import { Input } from "~/features/shared/components/ui/input";
import useGetFoodItemsPending from "../hooks/useGetFoodItemsPending";
import useToggleFoodItemPending from "../hooks/useToggleFoodItemPending";
import FoodItemPendingPreview, {
  FoodItemPendingPreviewEmpty,
  FoodItemPendingPreviewSkeleton,
} from "./FoodItemPendingPreview";
import { useDebounce } from "~/features/shared/hooks/useDebounce";

function FoodItemsPendingList() {
  const [page, setPage] = useState(1);
  // TODO: Make dynamic page size changes
  const [pageSize] = useState(4);
  const offset = useMemo(() => page * pageSize - pageSize, [page, pageSize]);
  const [textFilter, setTextFilter] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const debounceSetTextFilter = useDebounce(setTextFilter, 500);
  const {
    data: foodItemsPending,
    isLoading: foodItemsPendingLoading,
    isError: foodItemsPendingError,
  } = useGetFoodItemsPending({
    limit: pageSize,
    offset,
    text_filter: textFilter,
  });
  const { mutateAsync: toggleFoodItemPending } = useToggleFoodItemPending();

  function handleToggleFoodItemPending(foodItemPendingId: string) {
    void toggleFoodItemPending({
      food_item_pending_id: foodItemPendingId,
      limit: pageSize,
      offset,
      text_filter: textFilter,
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

  function onTextFilterChange(ev: React.ChangeEvent<HTMLInputElement>) {
    debounceSetTextFilter(ev.target.value ?? null);
    setInputValue(ev.target.value);
  }

  if (foodItemsPendingLoading) {
    return (
      <DashboardContentCards title="Food Items">
        <div className="flex justify-end">
          <Input
            placeholder="Search..."
            onChange={onTextFilterChange}
            value={inputValue}
          />
          <Link className={buttonVariants()} to="/dashboard/food_item/add">
            Add Food Item
          </Link>
        </div>
        <div className="gap-3 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 mt-2">
          <FoodItemPendingPreviewSkeleton />
          <FoodItemPendingPreviewSkeleton />
          <FoodItemPendingPreviewSkeleton />
          <FoodItemPendingPreviewSkeleton />
        </div>
        <ListPaginationButtons
          page={page}
          onChangePage={onChangePage}
          totalPages={foodItemsPending}
        />
      </DashboardContentCards>
    );
  }

  if (foodItemsPendingError || !foodItemsPending?.food_items_pending) {
    return (
      <DashboardContentCards title="Food Items">
        <div className="flex justify-end">
          <Input
            placeholder="Search..."
            onChange={onTextFilterChange}
            value={inputValue}
          />
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
        <Input
          placeholder="Search..."
          onChange={onTextFilterChange}
          value={inputValue}
        />
        <Link className={buttonVariants()} to="/dashboard/food_item/add">
          Add Food Item
        </Link>
      </div>
      <div className="gap-3 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 mt-2">
        {foodItemsPending.food_items_pending.map((foodItemPending) => (
          <FoodItemPendingPreview
            key={foodItemPending.id}
            foodItemPending={foodItemPending}
            handleToggleFoodItemPending={handleToggleFoodItemPending}
          />
        ))}
        {new Array(pageSize - foodItemsPending.food_items_pending.length)
          .fill("")
          .map((_, idx) => (
            <FoodItemPendingPreviewEmpty key={idx} />
          ))}
      </div>
      <ListPaginationButtons
        page={page}
        onChangePage={onChangePage}
        totalPages={foodItemsPending?.total_pages}
      />
    </DashboardContentCards>
  );
}

export default FoodItemsPendingList;

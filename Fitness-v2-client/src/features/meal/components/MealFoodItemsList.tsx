import { useMemo, useState } from "react";
import { useGetFoodItems } from "~/features/food_item/hooks/useGetFoodItems";
import { Label } from "~/features/shared/components/ui/label";
import { MultiSelect } from "~/features/shared/components/ui/multi-select";
import { useDebounce } from "~/features/shared/hooks/useDebounce";
import { arrayDiff } from "~/lib/utils";

type Props = {
  toggleFoodItems: (foodItems: FoodItem[]) => void;
};

function MealFoodItemsList({ toggleFoodItems }: Props) {
  const [pageSize, setPageSize] = useState(10);
  const [selectedFoodItems, setSelectedFoodItems] = useState<string[]>([]);
  const [textFilter, setTextFilter] = useState<string | null>(null);

  const debounceSetTextFilter = useDebounce(setTextFilter, 500);

  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    data: foodItemsWithPages,
    error: foodItemsWithPagesError,
    isError: isFoodItemsWithPagesError,
    isLoading: isFoodItemsWithPagesLoading,
    isFetching,
    isRefetching,
  } = useGetFoodItems({
    limit: pageSize,
    offset: 0, // Initial offset
    text_filter: textFilter,
  });

  const foodItemsList = useMemo(() => {
    return (
      foodItemsWithPages?.pages
        .flatMap((page) => page.food_items)
        .map((foodItem) => ({
          label: foodItem.name,
          value: foodItem.id,
        })) ?? []
    );
  }, [foodItemsWithPages]);

  function handleValueChange(value: string[]) {
    if (!foodItemsWithPages) {
      return;
    }
    setSelectedFoodItems(value);
    const diff = arrayDiff(value, selectedFoodItems);
    const diffFoodItems = foodItemsWithPages.pages.flatMap((page) =>
      page.food_items.filter((foodItem) => diff.includes(foodItem.id)),
    );

    toggleFoodItems(diffFoodItems);
  }

  function handleCommandInputValueChange(value: string) {
    debounceSetTextFilter(value);
  }

  function handleCommandScroll(ev: React.UIEvent<HTMLDivElement>) {
    if (
      ev.currentTarget.scrollHeight - ev.currentTarget.scrollTop ===
        ev.currentTarget.clientHeight &&
      hasNextPage
    ) {
      void fetchNextPage();
    }
  }

  if (isFoodItemsWithPagesError && foodItemsWithPagesError) {
    return <div>{foodItemsWithPagesError.message}</div>;
  }

  return (
    <div className="flex flex-col gap-2 mt-4">
      <Label>Food Items</Label>
      <MultiSelect
        options={foodItemsList}
        onValueChange={handleValueChange}
        defaultValue={selectedFoodItems}
        animation={2}
        maxCount={3}
        handleCommandScroll={handleCommandScroll}
        handleCommandInputValueChange={handleCommandInputValueChange}
        enableSelectAll={false}
      />
    </div>
  );
}

export default MealFoodItemsList;

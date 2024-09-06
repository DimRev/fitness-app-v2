import { useMemo, useState } from "react";
import { useGetFoodItems } from "~/features/food_item/hooks/useGetFoodItems";
import { Label } from "~/features/shared/components/ui/label";
import { MultiSelect } from "~/features/shared/components/ui/multi-select";
import { arrayDiff } from "~/lib/utils";

type Props = {
  toggleFoodItems: (foodItems: FoodItem[]) => void;
};

function MealFoodItemsList({ toggleFoodItems }: Props) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10000);
  const offset = useMemo(() => page * pageSize - pageSize, [page, pageSize]);

  const [selectedFoodItems, setSelectedFoodItems] = useState<string[]>([]);

  const {
    data: foodItemsWithPages,
    error: foodItemsWithPagesError,
    isLoading: isFoodItemsWithPagesLoading,
    isError: isFoodItemsWithPagesError,
  } = useGetFoodItems({
    limit: pageSize,
    offset,
  });

  const foodItemsList = useMemo(() => {
    if (!foodItemsWithPages?.food_items) return [];
    return foodItemsWithPages.food_items.map((foodItem) => {
      return {
        label: foodItem.name,
        value: foodItem.id,
      };
    });
  }, [foodItemsWithPages]);

  function handleValueChange(value: string[]) {
    if (!foodItemsWithPages || foodItemsWithPages?.food_items.length === 0) {
      return;
    }
    setSelectedFoodItems(value);
    const diff = arrayDiff(value, selectedFoodItems);
    const diffFoodItems = foodItemsWithPages.food_items.filter((foodItem) =>
      diff.includes(foodItem.id),
    );
    toggleFoodItems(diffFoodItems);
  }

  if (isFoodItemsWithPagesLoading) {
    return <div>Loading...</div>;
  }

  if (isFoodItemsWithPagesError && foodItemsWithPagesError) {
    return <div>{foodItemsWithPagesError.message}</div>;
  }

  if (!foodItemsWithPages?.food_items) {
    return <div>No food items found</div>;
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
        enableSelectAll={false}
      />
    </div>
  );
}

export default MealFoodItemsList;

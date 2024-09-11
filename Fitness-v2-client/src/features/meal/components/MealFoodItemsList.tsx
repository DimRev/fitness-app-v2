import { PopoverContent } from "@radix-ui/react-popover";
import { Square, SquareCheck, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useGetFoodItems } from "~/features/food_item/hooks/useGetFoodItems";
import { Badge } from "~/features/shared/components/ui/badge";
import { Button } from "~/features/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "~/features/shared/components/ui/card";
import { Input } from "~/features/shared/components/ui/input";
import {
  Popover,
  PopoverTrigger,
} from "~/features/shared/components/ui/popover";
import { Separator } from "~/features/shared/components/ui/separator";
import { useDebounce } from "~/features/shared/hooks/useDebounce";

type Props = {
  toggleFoodItems: (foodItems: FoodItem[]) => void;
};

function MealFoodItemsList({ toggleFoodItems }: Props) {
  const [pageSize] = useState(10);
  const [selectedFoodItems, setSelectedFoodItems] = useState<FoodItem[]>([]);
  const [textFilter, setTextFilter] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");

  const debounceSetTextFilter = useDebounce(setTextFilter, 500);

  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    data: foodItemsWithPages,
    error: foodItemsWithPagesError,
    isError: isFoodItemsWithPagesError,
  } = useGetFoodItems({
    limit: pageSize,
    offset: 0, // Initial offset
    text_filter: textFilter,
  });

  const foodItemsList = useMemo(() => {
    return foodItemsWithPages?.pages.flatMap((page) => page.food_items) ?? [];
  }, [foodItemsWithPages]);

  function handleInputValueChange(ev: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(ev.target.value);
    debounceSetTextFilter(ev.target.value);
  }

  function handleScroll(ev: React.UIEvent<HTMLDivElement>) {
    if (
      ev.currentTarget.scrollHeight - ev.currentTarget.scrollTop ===
        ev.currentTarget.clientHeight &&
      hasNextPage
    ) {
      console.log(
        ev.currentTarget.scrollHeight - ev.currentTarget.scrollTop,
        ev.currentTarget.clientHeight,
      );
      void fetchNextPage();
    }
  }

  if (isFoodItemsWithPagesError && foodItemsWithPagesError) {
    return <div>{foodItemsWithPagesError.message}</div>;
  }

  function onSelectFoodItem(foodItem: FoodItem) {
    toggleFoodItems([foodItem]);
    const foodItemIdx = selectedFoodItems.findIndex(
      (item) => item.id === foodItem.id,
    );
    if (foodItemIdx === -1) {
      setSelectedFoodItems((prev) => [...prev, foodItem]);
    } else {
      setSelectedFoodItems((prev) =>
        prev.filter((item) => item.id !== foodItem.id),
      );
    }
  }

  return (
    <div className="mt-4 flex flex-col gap-2">
      <Popover>
        <PopoverTrigger>
          <div className="flex min-h-10 flex-wrap items-center justify-start gap-2 rounded-md border border-black/25 bg-input px-1 py-2">
            {selectedFoodItems.map((foodItem) => (
              <Badge
                key={foodItem.id}
                onClick={(ev) => {
                  ev.stopPropagation();
                  onSelectFoodItem(foodItem);
                }}
                className="flex gap-2"
                variant="secondary"
              >
                <div>{foodItem.name}</div>
                <div className="m-0 size-4 rounded-full p-0">
                  <X className="size-4" />
                </div>
              </Badge>
            ))}
          </div>
        </PopoverTrigger>
        <PopoverContent>
          <Card className="m-0 p-0">
            <CardHeader className="m-0 p-2">
              <Input
                placeholder="Search..."
                value={inputValue}
                onChange={handleInputValueChange}
              />
              <Separator />
              <CardContent className="m-0 p-2">
                <div className="h-52 overflow-y-auto" onScroll={handleScroll}>
                  {foodItemsList.map((foodItem) => (
                    <Button
                      onClick={() => onSelectFoodItem(foodItem)}
                      variant="ghost"
                      type="button"
                      key={foodItem.id}
                      className="grid w-full grid-cols-[1fr_10fr] items-center gap-2"
                    >
                      {selectedFoodItems.find(
                        (currFoodItem) => currFoodItem.id === foodItem.id,
                      )?.name === foodItem.name ? (
                        <SquareCheck />
                      ) : (
                        <Square />
                      )}
                      <div>{foodItem.name}</div>
                    </Button>
                  ))}
                  {foodItemsList.length === 0 && (
                    <div className="grid w-full grid-cols-[1fr_10fr] items-center gap-2 font-bold">
                      <X />
                      <div className="text-center">No food items found</div>
                    </div>
                  )}
                  {isFetchingNextPage && <div>Loading...</div>}
                </div>
              </CardContent>
            </CardHeader>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default MealFoodItemsList;

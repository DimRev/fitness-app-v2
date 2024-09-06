import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { H2, H4 } from "~/features/shared/components/Typography";
import { Button } from "~/features/shared/components/ui/button";
import { FormField, FormLabel } from "~/features/shared/components/ui/form";
import { Input } from "~/features/shared/components/ui/input";
import { Label } from "~/features/shared/components/ui/label";

type Props = {
  FoodItemWithPages: FoodItemWithPages | undefined;
  FoodItemWithPagesError: Error | null;
  isFoodItemWithPagesLoading: boolean;
  isFoodItemWithPagesError: boolean;
  page: number;
  pageSize: number;
};

function MealFoodItemsList({
  FoodItemWithPages: foodItems,
  FoodItemWithPagesError: foodItemsError,
  isFoodItemWithPagesLoading: isFoodItemsLoading,
  isFoodItemWithPagesError: isFoodItemsError,
  page,
  pageSize,
}: Props) {
  if (isFoodItemsLoading) {
    return <div>Loading...</div>;
  }

  if (isFoodItemsError && foodItemsError) {
    return <div>{foodItemsError.message}</div>;
  }

  if (!foodItems?.food_items) {
    return <div>No food items found</div>;
  }

  return <div className="flex flex-col gap-2 mt-4"></div>;
}

export default MealFoodItemsList;

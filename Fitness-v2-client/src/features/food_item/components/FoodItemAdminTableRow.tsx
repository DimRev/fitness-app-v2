import { X } from "lucide-react";
import useLayoutStore from "~/features/layout/hooks/useLayoutStore";
import { Button } from "~/features/shared/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/features/shared/components/ui/hover-card";
import { Skeleton } from "~/features/shared/components/ui/skeleton";
import { TableCell, TableRow } from "~/features/shared/components/ui/table";
import { cn } from "~/lib/utils";

type Props = {
  foodItem: FoodItem;
  handleDeleteFoodItem: (foodItemId: string) => void;
  isPending: boolean;
};

function FoodItemAdminTableRow({
  foodItem,
  isPending,
  handleDeleteFoodItem,
}: Props) {
  const { setIsConfirmationDialogOpen } = useLayoutStore();
  function onDeleteFoodItem() {
    setIsConfirmationDialogOpen(
      true,
      "Are you sure you want to delete this food item?",
      () => {
        handleDeleteFoodItem(foodItem.id);
      },
    );
  }
  return (
    <TableRow className={cn(isPending && "opacity-50 hover:bg-transparent")}>
      <TableCell className="py-4">
        <div className="line-clamp-1 break-words">{foodItem.name}</div>
      </TableCell>
      <TableCell className="py-2">
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className="line-clamp-1 break-words">
              {foodItem.description}
            </div>
          </HoverCardTrigger>
          <HoverCardContent>{foodItem.description}</HoverCardContent>
        </HoverCard>
      </TableCell>
      <TableCell className="py-2">
        <div className="line-clamp-1 break-words">{foodItem.food_type}</div>
      </TableCell>
      <TableCell className="py-2">
        <div className="line-clamp-1 break-words">{foodItem.calories}</div>
      </TableCell>
      <TableCell className="py-2">
        <div className="line-clamp-1 break-words">{foodItem.fat}</div>
      </TableCell>
      <TableCell className="py-2">
        <div className="line-clamp-1 break-words">{foodItem.protein}</div>
      </TableCell>
      <TableCell className="py-2">
        <div className="line-clamp-1 break-words">{foodItem.carbs}</div>
      </TableCell>

      <TableCell className="py-2">
        <div className="flex items-center gap-2 line-clamp-1 break-words">
          <Button
            size="icon"
            className="rounded-full size-8"
            variant="destructive"
            disabled={isPending}
            onClick={onDeleteFoodItem}
          >
            <X />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function FoodItemAdminTableRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="w-full h-[20px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-full h-[20px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-full h-[20px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-full h-[20px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-full h-[20px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-full h-[20px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-full h-[20px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-full h-[20px]" />
      </TableCell>
    </TableRow>
  );
}

export function FoodItemAdminTableRowEmpty() {
  return (
    <TableRow>
      <TableCell>
        <div className="py-[10.25px]"></div>
      </TableCell>
      <TableCell>
        <div className="py-[10.25px]"></div>
      </TableCell>
      <TableCell>
        <div className="py-[10.25px]"></div>
      </TableCell>
      <TableCell>
        <div className="py-[10.25px]"></div>
      </TableCell>
      <TableCell>
        <div className="py-[10.25px]"></div>
      </TableCell>
      <TableCell>
        <div className="py-[10.25px]"></div>
      </TableCell>
      <TableCell>
        <div className="py-[10.25px]"></div>
      </TableCell>
      <TableCell>
        <div className="py-[10.25px]"></div>
      </TableCell>
    </TableRow>
  );
}

export default FoodItemAdminTableRow;

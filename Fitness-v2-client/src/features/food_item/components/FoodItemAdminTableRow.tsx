import { Pencil, X } from "lucide-react";
import { Link } from "react-router-dom";
import useLayoutStore from "~/features/layout/hooks/useLayoutStore";
import { Button, buttonVariants } from "~/features/shared/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/features/shared/components/ui/hover-card";
import { Skeleton } from "~/features/shared/components/ui/skeleton";
import { TableCell, TableRow } from "~/features/shared/components/ui/table";
import { cn } from "~/lib/utils";
import FoodItemBadge from "./FoodItemBadge";

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
    <TableRow
      className={cn(isPending && "opacity-50 hover:bg-transparent", "h-[65px]")}
    >
      <TableCell>
        <div className="line-clamp-1 break-words">{foodItem.name}</div>
      </TableCell>
      <TableCell>
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className="line-clamp-1 break-words">
              {foodItem.description}
            </div>
          </HoverCardTrigger>
          <HoverCardContent>{foodItem.description}</HoverCardContent>
        </HoverCard>
      </TableCell>
      <TableCell>
        <FoodItemBadge foodItemTypes={foodItem.food_type} />
      </TableCell>
      <TableCell>
        <div className="line-clamp-1 break-words">{foodItem.calories}</div>
      </TableCell>
      <TableCell>
        <div className="line-clamp-1 break-words">{foodItem.fat}</div>
      </TableCell>
      <TableCell>
        <div className="line-clamp-1 break-words">{foodItem.protein}</div>
      </TableCell>
      <TableCell>
        <div className="line-clamp-1 break-words">{foodItem.carbs}</div>
      </TableCell>

      <TableCell>
        <div className="line-clamp-1 flex items-center gap-2 break-words">
          <Link
            className={cn(
              buttonVariants({
                size: "icon",
              }),
              "size-8 rounded-full",
            )}
            to={`/admin/food_item/edit/${foodItem.id}`}
          >
            <Pencil />
          </Link>
          <Button
            size="icon"
            className="size-8 rounded-full"
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
    <TableRow className="h-[65px]">
      <TableCell>
        <Skeleton className="h-[20px] w-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-[20px] w-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-[20px] w-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-[20px] w-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-[20px] w-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-[20px] w-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-[20px] w-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-[20px] w-full" />
      </TableCell>
    </TableRow>
  );
}

export function FoodItemAdminTableRowEmpty() {
  return (
    <TableRow>
      <TableCell className="h-[65px]">
        <div></div>
      </TableCell>
      <TableCell>
        <div></div>
      </TableCell>
      <TableCell>
        <div></div>
      </TableCell>
      <TableCell>
        <div></div>
      </TableCell>
      <TableCell>
        <div></div>
      </TableCell>
      <TableCell>
        <div></div>
      </TableCell>
      <TableCell>
        <div></div>
      </TableCell>
      <TableCell>
        <div className="py-[10.25px]"></div>
      </TableCell>
    </TableRow>
  );
}

export default FoodItemAdminTableRow;

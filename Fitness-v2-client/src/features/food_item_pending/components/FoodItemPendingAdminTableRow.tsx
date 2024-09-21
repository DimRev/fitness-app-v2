import { Check, X } from "lucide-react";
import FoodItemBadge from "~/features/food_item/components/FoodItemBadge";
import useLayoutStore from "~/features/layout/hooks/useLayoutStore";
import { H3 } from "~/features/shared/components/Typography";
import { Button } from "~/features/shared/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/features/shared/components/ui/hover-card";
import { Separator } from "~/features/shared/components/ui/separator";
import { Skeleton } from "~/features/shared/components/ui/skeleton";
import { TableCell, TableRow } from "~/features/shared/components/ui/table";
import { cn } from "~/lib/utils";

type Props = {
  foodItemPending: FoodItemsPending;
  handleApproveFoodItemPending: (foodItemPendingId: string) => void;
  handleRejectFoodItemPending: (foodItemPendingId: string) => void;
  isPending: boolean;
};

function FoodItemPendingAdminTableRow({
  foodItemPending,
  handleApproveFoodItemPending,
  handleRejectFoodItemPending,
  isPending,
}: Props) {
  const { setIsConfirmationDialogOpen } = useLayoutStore();

  function onApproveFoodItemPending() {
    setIsConfirmationDialogOpen(
      true,
      "Are you sure you want to approve this food item?",
      () => {
        handleApproveFoodItemPending(foodItemPending.id);
      },
    );
  }

  function onRejectFoodItemPending() {
    setIsConfirmationDialogOpen(
      true,
      "Are you sure you want to reject this food item?",
      () => {
        handleRejectFoodItemPending(foodItemPending.id);
      },
    );
  }

  return (
    <TableRow
      className={cn(isPending && "opacity-50 hover:bg-transparent", "h-[65px]")}
    >
      <TableCell>
        <div className="line-clamp-1 break-words">{foodItemPending.name}</div>
      </TableCell>
      <TableCell>
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className="line-clamp-1 break-words cursor-cell">
              {foodItemPending.description}
            </div>
          </HoverCardTrigger>
          <HoverCardContent>
            <H3>{foodItemPending.name}</H3>
            <Separator />
            {foodItemPending.description}
          </HoverCardContent>
        </HoverCard>
      </TableCell>
      <TableCell>
        <FoodItemBadge foodItemTypes={foodItemPending.food_type} />
      </TableCell>
      <TableCell>
        <div className="line-clamp-1 break-words">
          {foodItemPending.calories}
        </div>
      </TableCell>
      <TableCell>
        <div className="line-clamp-1 break-words">{foodItemPending.fat}</div>
      </TableCell>
      <TableCell>
        <div className="line-clamp-1 break-words">
          {foodItemPending.protein}
        </div>
      </TableCell>
      <TableCell>
        <div className="line-clamp-1 break-words">{foodItemPending.carbs}</div>
      </TableCell>
      <TableCell>
        <div className="line-clamp-1 break-words">{foodItemPending.likes}</div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2 line-clamp-1 break-words">
          <Button
            size="icon"
            className="rounded-full size-8"
            variant="constructive"
            onClick={onApproveFoodItemPending}
            disabled={isPending}
          >
            <Check />
          </Button>
          <Button
            size="icon"
            className="rounded-full size-8"
            variant="destructive"
            onClick={onRejectFoodItemPending}
            disabled={isPending}
          >
            <X />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function FoodItemPendingAdminTableRowSkeleton() {
  return (
    <TableRow className="h-[65px]">
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
      <TableCell>
        <Skeleton className="w-full h-[20px]" />
      </TableCell>
    </TableRow>
  );
}

export function FoodItemPendingAdminTableRowEmpty() {
  return (
    <TableRow className="h-[65px]">
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
        <div></div>
      </TableCell>
      <TableCell>
        <div></div>
      </TableCell>
      <TableCell>
        <div></div>
      </TableCell>
    </TableRow>
  );
}

export default FoodItemPendingAdminTableRow;

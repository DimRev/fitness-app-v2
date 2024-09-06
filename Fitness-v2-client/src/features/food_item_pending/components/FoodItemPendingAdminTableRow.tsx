import { Check, X } from "lucide-react";
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
  function onApproveFoodItemPending() {
    handleApproveFoodItemPending(foodItemPending.id);
  }

  function onRejectFoodItemPending() {
    handleRejectFoodItemPending(foodItemPending.id);
  }

  return (
    <TableRow className={cn(isPending && "opacity-50 hover:bg-transparent")}>
      <TableCell>
        <div className="line-clamp-1 break-words">{foodItemPending.name}</div>
      </TableCell>
      <TableCell>
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className="line-clamp-1 break-words">
              {foodItemPending.description}
            </div>
          </HoverCardTrigger>
          <HoverCardContent>{foodItemPending.description}</HoverCardContent>
        </HoverCard>
      </TableCell>
      <TableCell>
        <div className="line-clamp-1 break-words">
          {foodItemPending.food_type}
        </div>
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
    <TableRow>
      <TableCell>
        <Skeleton className="w-full h-[19px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-full h-[19px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-full h-[19px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-full h-[19px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-full h-[19px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-full h-[19px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-full h-[19px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-full h-[19px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-full h-[19px]" />
      </TableCell>
    </TableRow>
  );
}

export function FoodItemPendingAdminTableRowEmpty() {
  return (
    <TableRow>
      <TableCell>
        <div className="py-[10px]"></div>
      </TableCell>
      <TableCell>
        <div className="py-[10px]"></div>
      </TableCell>
      <TableCell>
        <div className="py-[10px]"></div>
      </TableCell>
      <TableCell>
        <div className="py-[10px]"></div>
      </TableCell>
      <TableCell>
        <div className="py-[10px]"></div>
      </TableCell>
      <TableCell>
        <div className="py-2"></div>
      </TableCell>
      <TableCell>
        <div className="py-2"></div>
      </TableCell>
      <TableCell>
        <div className="py-2"></div>
      </TableCell>
      <TableCell>
        <div className="py-2"></div>
      </TableCell>
    </TableRow>
  );
}

export default FoodItemPendingAdminTableRow;

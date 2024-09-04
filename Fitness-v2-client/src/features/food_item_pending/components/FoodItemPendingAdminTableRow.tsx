import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/features/shared/components/ui/hover-card";
import { Skeleton } from "~/features/shared/components/ui/skeleton";
import { TableCell, TableRow } from "~/features/shared/components/ui/table";

type Props = {
  foodItemPending: FoodItemsPending;
};

function FoodItemPendingAdminTableRow({ foodItemPending }: Props) {
  return (
    <TableRow>
      <TableCell>
        <div className="line-clamp-1 break-words">
          {foodItemPending.description}
        </div>
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
    </TableRow>
  );
}

export default FoodItemPendingAdminTableRow;

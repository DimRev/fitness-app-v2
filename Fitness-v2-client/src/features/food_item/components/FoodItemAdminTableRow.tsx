import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/features/shared/components/ui/hover-card";
import { TableCell, TableRow } from "~/features/shared/components/ui/table";
import { cn } from "~/lib/utils";

type Props = {
  foodItem: FoodItem;
  isPending: boolean;
};

function FoodItemAdminTableRow({ foodItem, isPending }: Props) {
  return (
    <TableRow className={cn(isPending && "opacity-50 hover:bg-transparent")}>
      <TableCell className="py-2">
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
          actions...
        </div>
      </TableCell>
    </TableRow>
  );
}

export default FoodItemAdminTableRow;

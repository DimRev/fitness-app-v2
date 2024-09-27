import { Apple, Carrot, Croissant, Ham, X } from "lucide-react";
import { Badge } from "~/features/shared/components/ui/badge";
import { cn } from "~/lib/utils";

type Props = {
  foodItemTypes?: FoodItemType;
} & React.HTMLAttributes<HTMLDivElement>;

function FoodItemBadge({ foodItemTypes, ...props }: Props) {
  switch (foodItemTypes) {
    case "fruit":
      return (
        <Badge
          className={cn(
            props.className,
            "flex w-fit gap-2 bg-green-500 font-bold text-foreground dark:bg-green-300 dark:text-muted",
          )}
          {...props}
        >
          <Apple />
          Fruit
        </Badge>
      );
    case "grain":
      return (
        <Badge
          className={cn(
            props.className,
            "flex w-fit gap-2 bg-yellow-500 font-bold text-foreground dark:bg-yellow-300 dark:text-muted",
          )}
          {...props}
        >
          <Croissant />
          Grain
        </Badge>
      );
    case "protein":
      return (
        <Badge
          className={cn(
            "flex w-fit gap-2 bg-orange-500 font-bold text-foreground dark:bg-orange-300 dark:text-muted",
            props.className,
          )}
          {...props}
        >
          <Ham />
          Protein
        </Badge>
      );
    case "vegetable":
      return (
        <Badge
          className={cn(
            "flex w-fit gap-2 bg-lime-500 font-bold text-foreground dark:bg-lime-300 dark:text-muted",
            props.className,
          )}
          {...props}
        >
          <Carrot />
          Vegetable
        </Badge>
      );
    default:
      return (
        <Badge
          className={cn(
            "flex w-fit gap-2 bg-zinc-500 font-bold text-foreground dark:bg-zinc-300 dark:text-muted",
            props.className,
          )}
          {...props}
        >
          <X />
        </Badge>
      );
  }
}

export default FoodItemBadge;

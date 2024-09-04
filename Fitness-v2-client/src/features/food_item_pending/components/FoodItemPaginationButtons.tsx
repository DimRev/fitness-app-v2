import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "~/features/shared/components/ui/button";

type Props = {
  page: number;
  onChangePage: (type: "next" | "prev") => void;
  foodItemsPending: FoodItemsPendingWithPages | undefined;
};

export function FoodItemPaginationButtons({
  page,
  onChangePage,
  foodItemsPending,
}: Props) {
  return (
    <div className="flex justify-end items-center gap-2 py-2">
      <Button
        size="icon"
        variant="ghost"
        disabled={page === 1}
        onClick={() => onChangePage("prev")}
      >
        <ChevronLeft />
      </Button>
      <div>
        <span>{page}</span>
        <span>
          {foodItemsPending?.total_pages
            ? ` / ${foodItemsPending.total_pages}`
            : " / 1"}
        </span>
      </div>
      <Button
        size="icon"
        variant="ghost"
        disabled={
          page === foodItemsPending?.total_pages ||
          !!foodItemsPending?.total_pages
        }
        onClick={() => onChangePage("next")}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}

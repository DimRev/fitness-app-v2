import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "~/features/shared/components/ui/button";

type Props = {
  page: number;
  onChangePage: (type: "next" | "prev") => void;
  totalPages: number | undefined;
};

function ListPaginationButtons({ page, onChangePage, totalPages }: Props) {
  return (
    <div className="flex items-center justify-end gap-2 py-2">
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
        <span>{totalPages ? ` / ${totalPages}` : " / 1"}</span>
      </div>
      <Button
        size="icon"
        variant="ghost"
        disabled={!totalPages || page === totalPages}
        onClick={() => onChangePage("next")}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}

export default ListPaginationButtons;

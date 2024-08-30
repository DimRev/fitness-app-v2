import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Button, buttonVariants } from "~/features/shared/components/ui/button";
import useLayoutStore from "../hooks/useLayoutStore";

function SidebarDashboard() {
  const { isSidebarOpen, setIsSidebarOpen } = useLayoutStore();

  if (!isSidebarOpen) {
    return (
      <nav className="flex flex-col items-center gap-2 pt-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsSidebarOpen()}
        >
          <ChevronRight />
        </Button>
        <div className="border-b-2 w-full"></div>

        <Link
          to="/dashboard"
          className={buttonVariants({ variant: "outline", size: "icon" })}
        >
          <Search className="size-5" />
        </Link>
      </nav>
    );
  }

  return (
    <nav className="relative flex flex-col items-start gap-2 px-2 pt-2">
      <div className="flex justify-between items-center gap-2 w-full">
        <h3 className="font-bold text-lg truncate">Dashboard</h3>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsSidebarOpen()}
        >
          <ChevronLeft />
        </Button>
      </div>
      <div className="border-b-2 w-full"></div>
      <Link
        to="/dashboard"
        className={buttonVariants({
          variant: "outline",
          className: "grid w-full grid-cols-[auto_1fr]",
        })}
      >
        <Search className="me-4 size-4" />
        <span>Overview</span>
      </Link>
      <Link
        to="/dashboard"
        className={buttonVariants({
          variant: "outline",
          className: "grid w-full grid-cols-[auto_1fr]",
        })}
      >
        <Search className="me-4 size-4" />
        <span>Overview</span>
      </Link>
      <Link
        to="/dashboard"
        className={buttonVariants({
          variant: "outline",
          className: "grid w-full grid-cols-[auto_1fr]",
        })}
      >
        <Search className="me-4 size-4" />
        <span>Overview</span>
      </Link>
    </nav>
  );
}

export default SidebarDashboard;

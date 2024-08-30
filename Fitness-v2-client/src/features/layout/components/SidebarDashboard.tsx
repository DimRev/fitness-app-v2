import { ChevronLeft, ChevronRight, Sandwich, Search } from "lucide-react";
import { Button } from "~/features/shared/components/ui/button";
import { cn } from "~/lib/utils";
import useLayoutStore from "../hooks/useLayoutStore";
import SidebarNavLink from "./SidebarNavLink";
import { H3 } from "~/features/shared/components/Typography";

function SidebarDashboard() {
  const { isSidebarOpen, setIsSidebarOpen } = useLayoutStore();

  return (
    <nav
      className={cn(
        "flex flex-col items-center gap-2 pt-2",
        isSidebarOpen ? "px-2" : "",
      )}
    >
      {isSidebarOpen ? (
        <>
          <div className="flex justify-between items-center gap-2 w-full">
            <H3 className="truncate">Dashboard</H3>
            <Button
              className="bg-sidebar"
              variant="outline"
              size="icon"
              onClick={() => setIsSidebarOpen()}
            >
              <ChevronLeft />
            </Button>
          </div>
        </>
      ) : (
        <>
          <Button
            className="bg-sidebar"
            variant="outline"
            size="icon"
            onClick={() => setIsSidebarOpen()}
          >
            <ChevronRight />
          </Button>
        </>
      )}
      <div className="border-b-2 w-full"></div>
      <SidebarNavLink
        LucideIcon={Search}
        to="/dashboard"
        title="Overview"
        onlyIcon={!isSidebarOpen}
      />
      <SidebarNavLink
        LucideIcon={Sandwich}
        to="/dashboard/meal"
        title="Meals"
        onlyIcon={!isSidebarOpen}
      />
    </nav>
  );
}

export default SidebarDashboard;

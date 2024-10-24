import {
  Apple,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Coins,
  LineChart,
  Sandwich,
  Scale,
} from "lucide-react";
import { H3 } from "~/features/shared/components/Typography";
import { Button } from "~/features/shared/components/ui/button";
import { cn } from "~/lib/utils";
import useLayoutStore from "../hooks/useLayoutStore";
import SidebarNavLink from "./SidebarNavLink";

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
          <div className="flex w-full items-center justify-between gap-2">
            <H3 className="truncate">Dashboard</H3>
            <Button
              className="border-foreground bg-sidebar"
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
            className="border-foreground bg-sidebar"
            variant="outline"
            size="icon"
            onClick={() => setIsSidebarOpen()}
          >
            <ChevronRight />
          </Button>
        </>
      )}
      <div className="w-full border-b border-foreground"></div>
      <SidebarNavLink
        LucideIcon={LineChart}
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
      <SidebarNavLink
        LucideIcon={Apple}
        to="/dashboard/food_item"
        title="Food Items"
        onlyIcon={!isSidebarOpen}
      />
      <SidebarNavLink
        LucideIcon={Scale}
        to="/dashboard/measurement"
        title="Measurements"
        onlyIcon={!isSidebarOpen}
      />
      <SidebarNavLink
        LucideIcon={Calendar}
        to="/dashboard/calendar"
        title="Calendar"
        onlyIcon={!isSidebarOpen}
      />
      <SidebarNavLink
        LucideIcon={Coins}
        to="/dashboard/score"
        title="Score"
        onlyIcon={!isSidebarOpen}
      />
    </nav>
  );
}

export default SidebarDashboard;

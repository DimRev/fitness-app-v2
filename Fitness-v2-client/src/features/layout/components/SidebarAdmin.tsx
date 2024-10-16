import {
  Apple,
  ChevronLeft,
  ChevronRight,
  Info,
  LineChart,
  User,
} from "lucide-react";
import { H3 } from "~/features/shared/components/Typography";
import { Button } from "~/features/shared/components/ui/button";
import { cn } from "~/lib/utils";
import useLayoutStore from "../hooks/useLayoutStore";
import SidebarNavLink from "./SidebarNavLink";

function SidebarAdmin() {
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
            <H3 className="truncate">Admin</H3>
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
        to="/admin"
        title="Overview"
        onlyIcon={!isSidebarOpen}
      />
      <SidebarNavLink
        LucideIcon={User}
        to="/admin/user"
        title="Users"
        onlyIcon={!isSidebarOpen}
      />
      <SidebarNavLink
        LucideIcon={Apple}
        to="/admin/food_item_pending"
        title="Food Items Pending"
        onlyIcon={!isSidebarOpen}
      />
      <SidebarNavLink
        LucideIcon={Apple}
        to="/admin/food_item"
        title="Food Items"
        onlyIcon={!isSidebarOpen}
      />
      <SidebarNavLink
        LucideIcon={Info}
        to="/admin/support_ticket"
        title="Support Tickets"
        onlyIcon={!isSidebarOpen}
      />
    </nav>
  );
}

export default SidebarAdmin;

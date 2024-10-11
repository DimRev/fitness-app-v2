import { Info } from "lucide-react";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "~/features/auth/hooks/useAuthStore";
import SidebarDashboard from "~/features/layout/components/SidebarDashboard";
import useLayoutStore from "~/features/layout/hooks/useLayoutStore";
import { Button } from "~/features/shared/components/ui/button";

function DashboardLayout() {
  const { user } = useAuthStore();
  const { isSidebarOpen, setSupportTicketDialogOpen } = useLayoutStore();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (!user) {
      if (
        location.pathname === "/dashboard" ||
        location.pathname === "/dashboard/"
      ) {
        navigate("/auth/login");
      }
    }
  }, [location, navigate, user]);
  if (!user) {
    return <></>;
  }

  if (!isSidebarOpen) {
    return (
      <div className="flex">
        <div className="h-main w-dashboardSidebar-sm border-e border-foreground bg-sidebar">
          <div className="flex h-full flex-col">
            <div className="flex-1">
              <SidebarDashboard />
            </div>
            <div className="flex justify-center py-4">
              <Button
                size="icon"
                className="flex items-center gap-2 font-light"
                onClick={() => setSupportTicketDialogOpen(true)}
              >
                <Info strokeWidth={2} />
              </Button>
            </div>
          </div>
        </div>
        <div className="px-4">
          <Outlet />
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="h-main w-dashboardSidebar-md border-e border-foreground bg-sidebar md:w-dashboardSidebar-lg">
        <div className="flex h-full flex-col">
          <div className="flex-1">
            <SidebarDashboard />
          </div>
          <div className="flex justify-center py-4">
            <Button
              className="flex items-center gap-2 font-light"
              onClick={() => setSupportTicketDialogOpen(true)}
            >
              <Info strokeWidth={2} />
              <span>Open support ticket</span>
            </Button>
          </div>
        </div>
      </div>
      <div className="px-4">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;

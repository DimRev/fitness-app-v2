import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "~/features/auth/hooks/useAuthStore";
import SidebarDashboard from "~/features/layout/components/SidebarDashboard";
import useLayoutStore from "~/features/layout/hooks/useLayoutStore";

function DashboardLayout() {
  const { user } = useAuthStore();
  const { isSidebarOpen } = useLayoutStore();
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
          <SidebarDashboard />
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
        <SidebarDashboard />
      </div>
      <div className="px-4">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;

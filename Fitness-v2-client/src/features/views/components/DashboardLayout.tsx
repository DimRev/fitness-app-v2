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
        <div className="border-e-2 w-dashboardSidebar-sm h-main">
          <SidebarDashboard />
        </div>
        <div className="w-dashboard-sm h-main">
          <Outlet />
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="border-e-2 w-dashboardSidebar-md md:w-dashboardSidebar-lg h-main">
        <SidebarDashboard />
      </div>
      <div className="w-dashboard-md md:w-dashboard-lg h-main">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;

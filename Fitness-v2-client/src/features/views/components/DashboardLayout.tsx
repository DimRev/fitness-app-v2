import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "~/features/auth/hooks/useAuthStore";
import SidebarDashboard from "~/features/layout/components/SidebarDashboard";

function DashboardLayout() {
  const { user } = useAuthStore();
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
  return (
    <div className="flex">
      <div className="border-e-2 w-dashboardSidebar-sm sm:w-dashboardSidebar-md md:w-dashboardSidebar-lg h-main">
        <SidebarDashboard />
      </div>
      <div className="w-dashboard-sm sm:w-dashboard-md md:w-dashboard-lg h-main">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;

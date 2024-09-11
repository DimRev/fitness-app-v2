import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "~/features/auth/hooks/useAuthStore";
import SidebarAdmin from "~/features/layout/components/SidebarAdmin";
import useLayoutStore from "~/features/layout/hooks/useLayoutStore";

function AdminLayout() {
  const { user } = useAuthStore();
  const { isSidebarOpen } = useLayoutStore();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (!user || user.role !== "admin") {
      if (location.pathname === "/admin" || location.pathname === "/admin/") {
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
          <SidebarAdmin />
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
        <SidebarAdmin />
      </div>
      <div className="px-4">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;

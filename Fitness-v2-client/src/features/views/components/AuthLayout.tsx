import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "~/features/auth/hooks/useAuthStore";
import MainPageWrapper from "./MainPageWrapper";

function AuthLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  useEffect(() => {
    if (user) {
      navigate("/");
    }
    if (location.pathname === "/auth/" || location.pathname === "/auth") {
      navigate("/auth/login");
    }
  }, [location, navigate, user]);

  if (user) {
    return <></>;
  }

  return (
    <>
      <Outlet />
    </>
  );
}

export default AuthLayout;

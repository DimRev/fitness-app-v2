import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "~/features/auth/hooks/useAuthStore";
import MainPageWrapper from "./MainPage";

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
    <MainPageWrapper className="flex flex-col justify-center items-center">
      <Outlet />
    </MainPageWrapper>
  );
}

export default AuthLayout;

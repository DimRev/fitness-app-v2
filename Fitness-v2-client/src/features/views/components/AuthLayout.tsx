import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import MainPageWrapper from "./MainPage";
import useAuthStore from "~/features/auth/hooks/useAuthStore";

function AuthLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  useEffect(() => {
    if (user) {
      navigate("/");
    } else if (
      location.pathname === "/auth/" ||
      location.pathname === "/auth"
    ) {
      navigate("/auth/login");
    }
  }, [location, navigate, user]);

  return (
    <MainPageWrapper className="flex flex-col justify-center items-center">
      <Outlet />
    </MainPageWrapper>
  );
}

export default AuthLayout;

import { Outlet, useLocation, useNavigate } from "react-router-dom";
import MainPageWrapper from "./MainPage";
import { useEffect } from "react";

function AuthLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/auth/" || location.pathname === "/auth") {
      navigate("/auth/login");
    }
  }, [location]);

  return (
    <MainPageWrapper className="flex flex-col justify-center items-center">
      <Outlet />
    </MainPageWrapper>
  );
}

export default AuthLayout;

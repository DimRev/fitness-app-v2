import { useEffect, useLayoutEffect, useRef } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "~/features/shared/components/ui/sonner";
import AuthProvider from "./features/auth/components/AuthProvider";
import AppHeader from "./features/layout/components/AppHeader";
import GlobalDialogs from "./features/layout/components/GlobalDialogs";
import useLayoutStore from "./features/layout/hooks/useLayoutStore";
import useSocket from "./features/socket/hooks/useSocket";
import AboutPage from "./features/views/components/AboutPage";
import AdminFoodItemAddPage from "./features/views/components/AdminFoodItemAddPage";
import AdminFoodItemPendingPage from "./features/views/components/AdminFoodItemPendingPage";
import AdminLayout from "./features/views/components/AdminLayout";
import AdminOverviewPage from "./features/views/components/AdminOverviewPage";
import AdminUserPage from "./features/views/components/AdminUserPage";
import AuthLayout from "./features/views/components/AuthLayout";
import DashboardCalendarPage from "./features/views/components/DashboardCalendarPage";
import DashboardFoodItemPendingAddPage from "./features/views/components/DashboardFoodItemPendingAddPage";
import DashboardFoodItemPendingPage from "./features/views/components/DashboardFoodItemPendingPage";
import DashboardLayout from "./features/views/components/DashboardLayout";
import DashboardMealAddPage from "./features/views/components/DashboardMealAddPage";
import DashboardMealDetailsPage from "./features/views/components/DashboardMealDetailsPage";
import DashboardMealEditPage from "./features/views/components/DashboardMealEditPage";
import DashboardMealPage from "./features/views/components/DashboardMealPage";
import DashboardOverviewPage from "./features/views/components/DashboardOverviewPage";
import HomePage from "./features/views/components/HomePage";
import LoginPage from "./features/views/components/LoginPage";
import PageNotFound from "./features/views/components/PageNotFound";
import RegisterPage from "./features/views/components/RegisterPage";
import TestPage from "./features/views/components/TestPage";
import { cn } from "./lib/utils";
import AdminFoodItemPage from "./features/views/components/AdminFoodItemsPage";

const queryClient = new QueryClient();

function App() {
  const { isDarkMode, setIsDarkMode } = useLayoutStore();
  const { connSocket, disconnectSocket, socket } = useSocket();
  const isFirstLoad = useRef(true);

  // Set the initial theme based on the user's preferences
  useLayoutEffect(() => {
    const storedConfig = localStorage.getItem("fitness_app_config");
    if (storedConfig) {
      const layoutConfig = JSON.parse(storedConfig) as LayoutConfig;
      setIsDarkMode(layoutConfig.isDarkMode);
    } else {
      const prefersDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setIsDarkMode(prefersDarkMode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      void connSocket(queryClient);
      return;
    }

    return () => {
      if (!isFirstLoad.current) {
        void disconnectSocket();
      }
    };
  }, [connSocket, disconnectSocket]);

  useEffect(() => {
    if (!socket) {
      void connSocket(queryClient);
    }
  }, [socket, connSocket]);

  // test
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <div
            className={cn(
              "flex h-dvh w-screen flex-col overflow-hidden bg-background text-foreground antialiased",
              isDarkMode && "dark",
            )}
          >
            <AppHeader />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardOverviewPage />} />
                <Route path="meal" element={<DashboardMealPage />} />
                <Route path="meal/add" element={<DashboardMealAddPage />} />
                <Route
                  path="meal/details/:mealId"
                  element={<DashboardMealDetailsPage />}
                />
                <Route
                  path="meal/edit/:mealId"
                  element={<DashboardMealEditPage />}
                />
                <Route
                  path="food_item"
                  element={<DashboardFoodItemPendingPage />}
                />
                <Route
                  path="food_item/add"
                  element={<DashboardFoodItemPendingAddPage />}
                />
                <Route path="calendar" element={<DashboardCalendarPage />} />
              </Route>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminOverviewPage />} />
                <Route path="user" element={<AdminUserPage />} />
                <Route
                  path="food_item_pending"
                  element={<AdminFoodItemPendingPage />}
                />
                <Route path="food_item" element={<AdminFoodItemPage />} />
                <Route
                  path="food_item/add"
                  element={<AdminFoodItemAddPage />}
                />
              </Route>
              <Route path="/auth" element={<AuthLayout />}>
                <Route path="login" index element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
              </Route>
              <Route path="/test" element={<TestPage />} />

              <Route path="*" element={<PageNotFound />} />
            </Routes>

            <Toaster />
            <GlobalDialogs />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppHeader from "./features/layout/components/AppHeader";
import AboutPage from "./features/views/components/AboutPage";
import AuthLayout from "./features/views/components/AuthLayout";
import HomePage from "./features/views/components/HomePage";
import LoginPage from "./features/views/components/LoginPage";
import RegisterPage from "./features/views/components/RegisterPage";
import TestPage from "./features/views/components/TestPage";
import AuthProvider from "./features/auth/components/AuthProvider";
import DashboardLayout from "./features/views/components/DashboardLayout";
import DashboardOverviewPage from "./features/views/components/DashboardOverviewPage";
import DashboardMealPage from "./features/views/components/DashboardMealPage";
import useLayoutStore from "./features/layout/hooks/useLayoutStore";
import { cn } from "./lib/utils";
import PageNotFound from "./features/views/components/PageNotFound";
import DashboardMealAddPage from "./features/views/components/DashboardMealAddPage";
import AdminLayout from "./features/views/components/AdminLayout";
import AdminOverviewPage from "./features/views/components/AdminOverviewPage";
import AdminFoodItemPage from "./features/views/components/AdminFoodItemPage";
import AdminFoodItemAddPage from "./features/views/components/AdminFoodItemAddPage";
import DashboardFoodItemPendingPage from "./features/views/components/DashboardFoodItemPendingPage";
import DashboardFoodItemPendingAddPage from "./features/views/components/DashboardFoodItemPendingAddPage";
import DashboardMealDetailsPage from "./features/views/components/DashboardMealDetailsPage";
import { useLayoutEffect } from "react";

const queryClient = new QueryClient();

function App() {
  const { isDarkMode, setIsDarkMode } = useLayoutStore();

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
  }, []);

  console.log(
    `App is running in ${import.meta.env.MODE} connected to ${import.meta.env.VITE_API_URL}`,
  );

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
                  path="food_item"
                  element={<DashboardFoodItemPendingPage />}
                />
                <Route
                  path="food_item/add"
                  element={<DashboardFoodItemPendingAddPage />}
                />
              </Route>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminOverviewPage />} />
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
          </div>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

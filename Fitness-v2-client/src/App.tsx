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

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <div className="flex flex-col bg-background w-screen h-dvh text-foreground antialiased overflow-hidden">
            <AppHeader />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardOverviewPage />} />
              </Route>
              <Route path="/auth" element={<AuthLayout />}>
                <Route path="login" index element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
              </Route>
              <Route path="/test" element={<TestPage />} />
            </Routes>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

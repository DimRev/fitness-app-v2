import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./features/views/components/HomePage";
import AppHeader from "./features/layout/components/AppHeader";
import TestPage from "./features/views/components/TestPage";
import AuthLayout from "./features/views/components/AuthLayout";
import LoginPage from "./features/views/components/LoginPage";
import RegisterPage from "./features/views/components/RegisterPage";
import AboutPage from "./features/views/components/AboutPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="flex flex-col bg-background w-screen h-dvh text-foreground antialiased overflow-hidden">
          <AppHeader />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" index element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
            </Route>
            <Route path="/test" element={<TestPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

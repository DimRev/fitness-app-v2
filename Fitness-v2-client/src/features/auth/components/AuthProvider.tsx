import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../hooks/useAuthStore";
import useLoginFromCookie from "../hooks/useLoginFromCookie";
import useLoginFromSession from "../hooks/useLoginFromSession";
import useLayoutStore from "~/features/layout/hooks/useLayoutStore";

type Props = {
  children: React.ReactNode;
};

function AuthProvider({ children }: Props) {
  const { mutateAsync: loginFromCookie } = useLoginFromCookie();
  const { mutateAsync: loginFromSession } = useLoginFromSession();
  const [isAuthingUser, setIsAuthingUser] = useState(true);
  const { user, setUser } = useAuthStore();
  const navigate = useNavigate();
  const { isDarkMode } = useLayoutStore();

  useEffect(() => {
    // Check if user is already authenticated
    if (user) {
      setIsAuthingUser(false);
      return;
    }

    const sessionToken = sessionStorage.getItem("fitness_app_session");

    // First attempt to log in from cookie
    void loginFromCookie(undefined, {
      onSuccess: (user) => {
        setUser(user);
        setIsAuthingUser(false);
      },
      onError: () => {
        // If login from cookie fails, attempt to log in from session
        if (sessionToken) {
          void loginFromSession(
            { session_token: sessionToken },
            {
              onSuccess: (user) => {
                setUser(user);
                setIsAuthingUser(false);
              },
              onError: () => {
                setIsAuthingUser(false);
                navigate("/");
              },
            },
          );
        } else {
          setIsAuthingUser(false);
          navigate("/");
        }
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isAuthingUser) {
    // Show a consistent loading screen or skeleton component
    return (
      <div
        className={`flex h-dvh w-dvw items-center justify-center ${isDarkMode && "dark"}`}
      >
        <LoaderCircle className="size-24 animate-spin text-blue-700" />
      </div>
    );
  }

  return <>{children}</>;
}

export default AuthProvider;

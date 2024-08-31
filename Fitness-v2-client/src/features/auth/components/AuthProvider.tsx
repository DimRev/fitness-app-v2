import { useEffect, useState } from "react";
import useLoginFromCookie from "../hooks/useLoginFromCookie";
import useAuthStore from "../hooks/useAuthStore";
import useLoginFromSession from "../hooks/useLoginFromSession";
import { useNavigate } from "react-router-dom";
import { Loader, LoaderCircle, LoaderPinwheel } from "lucide-react";

type Props = {
  children: React.ReactNode;
};

function AuthProvider({ children }: Props) {
  const { mutateAsync: loginFromCookie } = useLoginFromCookie();
  const { mutateAsync: loginFromSession } = useLoginFromSession();
  const [isAuthingUser, setIsAuthingUser] = useState(true);
  const { user, setUser } = useAuthStore();
  const navigate = useNavigate();

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
  }, []);

  if (isAuthingUser) {
    // Show a consistent loading screen or skeleton component
    return (
      <div className="flex justify-center items-center w-dvw h-dvh">
        <LoaderCircle className="text-blue-700 animate-spin size-24" />
      </div>
    );
  }

  return <>{children}</>;
}

export default AuthProvider;

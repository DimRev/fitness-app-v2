import { useEffect } from "react";
import useLoginFromCookie from "../hooks/useLoginFromCookie";
import useAuthStore from "../hooks/useAuthStore";
import useLoginFromSession from "../hooks/useLoginFromSession";

type Props = {
  children: React.ReactNode;
};

function AuthProvider({ children }: Props) {
  const { mutateAsync: loginFromCookie, isLoading: isLoginFromCookieLoading } =
    useLoginFromCookie();
  const {
    mutateAsync: loginFromSession,
    isLoading: isLoginFromSessionLoading,
  } = useLoginFromSession();
  const { setUser } = useAuthStore();
  useEffect(() => {
    void loginFromCookie(undefined, {
      onSuccess: (user) => {
        setUser(user);
      },
      onError: (err) => {
        const sessionToken = sessionStorage.getItem("fitness_app_session");
        if (sessionToken) {
          void loginFromSession(
            { session_token: sessionToken },
            {
              onSuccess: (user) => {
                setUser(user);
              },
              onError: (err) => {
                console.error(err);
              },
            },
          );
        } else {
          console.error(err);
        }
      },
    });
  }, []);

  if (isLoginFromCookieLoading || isLoginFromSessionLoading) {
    return <div>Loading page...</div>;
  }

  return <>{children}</>;
}

export default AuthProvider;

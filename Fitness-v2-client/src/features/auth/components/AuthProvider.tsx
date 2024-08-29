import { useEffect } from "react";
import useLoginFromCookie from "../hooks/useLoginFromCookie";
import useAuthStore from "../hooks/useAuthStore";

type Props = {
  children: React.ReactNode;
};

function AuthProvider({ children }: Props) {
  const { mutateAsync: loginFromCookie, isLoading: isLoginFromCookieLoading } =
    useLoginFromCookie();
  const { setUser } = useAuthStore();
  useEffect(() => {
    void loginFromCookie(undefined, {
      onSuccess: (user) => {
        setUser(user);
      },
      onError: (err) => {
        console.error(err);
      },
    });
  }, []);

  if (isLoginFromCookieLoading) {
    return <div>Loading page...</div>;
  }
  return <>{children}</>;
}

export default AuthProvider;

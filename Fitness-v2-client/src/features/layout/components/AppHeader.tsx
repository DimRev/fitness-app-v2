import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import UserBadge from "~/features/auth/components/UserBadge";
import useAuthStore from "~/features/auth/hooks/useAuthStore";
import NotificationButton from "~/features/notification/components/NotificationButton";
import { buttonVariants } from "~/features/shared/components/ui/button";

function AppHeader() {
  const { user } = useAuthStore();
  const location = useLocation();
  const parentPath = useMemo(() => {
    return `/${location.pathname.split("/")[1]}`;
  }, [location]);

  return (
    <div className="flex h-header items-center justify-between border-b border-foreground bg-header px-4">
      <Link to="/">
        <div>Fitness</div>
      </Link>
      <nav className="flex items-center">
        <Link
          to="/"
          className={buttonVariants({
            variant: "link",
            className:
              parentPath === "/" ? "text-yellow-300 dark:text-yellow-500" : "",
          })}
        >
          Home
        </Link>
        <Link
          to="/about"
          className={buttonVariants({
            variant: "link",
            className:
              parentPath === "/about"
                ? "text-yellow-300 dark:text-yellow-500"
                : "",
          })}
        >
          About
        </Link>
        {user ? (
          <>
            <Link
              to="/dashboard"
              className={buttonVariants({
                variant: "link",
                className:
                  parentPath === "/dashboard"
                    ? "text-yellow-300 dark:text-yellow-500"
                    : "",
              })}
            >
              Dashboard
            </Link>

            {user.role === "admin" && (
              <Link
                to="/admin"
                className={buttonVariants({
                  variant: "link",
                  className:
                    parentPath === "/admin"
                      ? "text-yellow-300 dark:text-yellow-500"
                      : "",
                })}
              >
                Admin
              </Link>
            )}
            <NotificationButton />
            <UserBadge user={user} />
          </>
        ) : (
          <div className="flex gap-1">
            <Link
              to="/auth/register"
              className={buttonVariants({ variant: "ghost" })}
            >
              Register
            </Link>
            <Link to="/auth/login" className={buttonVariants()}>
              Login
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
}

export default AppHeader;

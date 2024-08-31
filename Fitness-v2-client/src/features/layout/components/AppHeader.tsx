import { Link } from "react-router-dom";
import UserBadge from "~/features/auth/components/UserBadge";
import useAuthStore from "~/features/auth/hooks/useAuthStore";
import { buttonVariants } from "~/features/shared/components/ui/button";

function AppHeader() {
  const { user } = useAuthStore();
  return (
    <div className="flex justify-between items-center border-foreground bg-header px-4 border-b h-header">
      <Link to="/">
        <div>Fitness</div>
      </Link>
      <nav className="flex items-center">
        <Link to="/" className={buttonVariants({ variant: "link" })}>
          Home
        </Link>
        <Link to="/about" className={buttonVariants({ variant: "link" })}>
          About
        </Link>
        {user ? (
          <>
            <Link
              to="/dashboard"
              className={buttonVariants({ variant: "link" })}
            >
              Dashboard
            </Link>

            {user.role === "admin" && (
              <Link to="/admin" className={buttonVariants({ variant: "link" })}>
                Admin
              </Link>
            )}
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

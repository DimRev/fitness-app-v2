import { Link } from "react-router-dom";
import UserBadge from "~/features/auth/components/UserBadge";
import useAuthStore from "~/features/auth/hooks/useAuthStore";
import { Button, buttonVariants } from "~/features/shared/components/ui/button";

function AppHeader() {
  const { user } = useAuthStore();
  return (
    <div className="flex justify-between items-center px-4 border-b-2 h-header">
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
          <UserBadge user={user} />
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

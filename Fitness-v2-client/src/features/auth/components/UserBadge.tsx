import { Button } from "~/features/shared/components/ui/button";
import useLogout from "../hooks/useLogout";
import useAuthStore from "../hooks/useAuthStore";

type Props = {
  user: User;
};

function UserBadge({ user }: Props) {
  const { mutateAsync: logout, isLoading: isLogoutLoading } = useLogout();
  const { setUser } = useAuthStore();
  async function handleLogout() {
    try {
      await logout(undefined, {
        onSuccess: () => {
          setUser(null);
        },
      });
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="flex items-center gap-1">
      <h3>{user.username}</h3>
      <Button disabled={isLogoutLoading} onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
}

export default UserBadge;

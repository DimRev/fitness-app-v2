import { Button } from "~/features/shared/components/ui/button";
import useLogout from "../hooks/useLogout";
import useAuthStore from "../hooks/useAuthStore";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/features/shared/components/ui/avatar";
import { useMemo } from "react";
import {
  Popover,
  PopoverContent,
} from "~/features/shared/components/ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { Moon, Settings, Sun } from "lucide-react";
import useLayoutStore from "~/features/layout/hooks/useLayoutStore";
import { cn } from "~/lib/utils";

type Props = {
  user: User;
};

function UserBadge({ user }: Props) {
  const { mutateAsync: logout, isLoading: isLogoutLoading } = useLogout();
  const { setUser } = useAuthStore();
  const { setIsDarkMode, isDarkMode } = useLayoutStore();
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

  const formattedUsername = useMemo(() => {
    const username = user.username;

    if (!username) {
      return "";
    }

    const firstLetter = username.charAt(0);
    let secondLetter = "";

    for (let i = 1; i < username.length; i++) {
      const currentChar = username.charAt(i);
      const previousChar = username.charAt(i - 1);

      if (
        previousChar.toLowerCase() === previousChar &&
        currentChar.toUpperCase() === currentChar
      ) {
        secondLetter = currentChar;
        break;
      }
    }

    return `${firstLetter}${secondLetter}`;
  }, [user]);

  return (
    <div className="flex items-center gap-1">
      <Popover>
        <PopoverTrigger>
          <Avatar>
            <AvatarImage src={user.imageUrl ?? undefined} />
            <AvatarFallback>{formattedUsername}</AvatarFallback>
          </Avatar>
        </PopoverTrigger>
        <PopoverContent>
          <h3 className="font-bold text-lg">{user.username}</h3>
          <p className="font-light text-sm">{user.email}</p>
          <div className="flex items-center gap-2 transition-colors duration-500 hover:cursor-pointer hover:fill-primary hover:text-primary">
            <Settings className="size-4" />
            <p>Settings</p>
          </div>
          <div className="flex gap-1 py-2">
            <Button
              size="icon"
              className={cn(!isDarkMode && "bg-yellow-500 hover:bg-yellow-700")}
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              <Sun className={cn("size-4", !isDarkMode && "stroke-black")} />
            </Button>
            <Button
              size="icon"
              className={cn(isDarkMode && "bg-blue-500 hover:bg-blue-700")}
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              <Moon className={cn("size-4", isDarkMode && "stroke-black")} />
            </Button>
          </div>
          <div className="flex justify-end">
            <Button
              variant="outline"
              disabled={isLogoutLoading}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default UserBadge;

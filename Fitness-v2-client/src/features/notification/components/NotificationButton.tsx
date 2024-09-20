import { Bell } from "lucide-react";
import useLayoutStore from "~/features/layout/hooks/useLayoutStore";
import { H4 } from "~/features/shared/components/Typography";
import { Button } from "~/features/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/features/shared/components/ui/popover";
import { Separator } from "~/features/shared/components/ui/separator";
import { cn } from "~/lib/utils";
import useGetNewUserNotifications from "../hooks/useGetNewUserNotifications";

function NotificationButton() {
  const { isDarkMode } = useLayoutStore();
  const { data: notifications, isLoading } = useGetNewUserNotifications();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative bg-header border-none me-4"
        >
          <Bell
            className={cn(
              !isLoading &&
                notifications &&
                notifications.length > 0 &&
                "fill-orange-500",
            )}
          />
          {!isLoading && (
            <div className="-top-1 absolute flex justify-center items-center border-foreground bg-orange-500 dark:bg-orange-800 border rounded-full -end-1 size-4">
              <span className="font-extrabold text-foreground text-xs">
                {notifications?.length}
              </span>
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn(isDarkMode && "dark")}>
        <H4 className="mb-2">Notifications</H4>
        <Separator />
        <div>
          {notifications && notifications.length > 0 ? (
            <div>
              {notifications.map((notification) => (
                <p key={notification.id}>
                  {notification.food_item_name} gained {notification.count}{" "}
                  likes!
                </p>
              ))}
            </div>
          ) : (
            <p>You have no notifications.</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default NotificationButton;

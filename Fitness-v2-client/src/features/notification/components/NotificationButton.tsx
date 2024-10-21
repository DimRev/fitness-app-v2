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
import useMarkNotificationAsRead from "../hooks/useMarkNotificationAsRead";
import { useMemo } from "react";
import NotificationFoodItem from "./NotificationFoodItem";
import NotificationScorePending from "./NotificationScore";

function NotificationButton() {
  const { isDarkMode } = useLayoutStore();
  const { data: notifications, isLoading } = useGetNewUserNotifications();
  const { mutateAsync: markNotificationAsRead } = useMarkNotificationAsRead();

  const totalNotificationLength = useMemo(() => {
    if (!notifications) {
      return 0;
    }

    return (
      notifications.food_item_likes.length +
      notifications.pending_score.length +
      notifications.approved_score.length +
      notifications.rejected_score.length
    );
  }, [notifications]);

  function handleClick(type: NotificationTypes, id: string) {
    switch (type) {
      case "user-like-food-item-pending":
        void markNotificationAsRead({
          type,
          food_item_pending_id: id,
        });
        break;
      case "user-score-pending":
      case "user-score-approved":
      case "user-score-rejected":
        void markNotificationAsRead({
          type,
          id,
        });
        break;
    }
  }

  if (isLoading || !notifications) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="relative me-4 border-none bg-header"
      >
        <Bell />
      </Button>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative me-4 border-none bg-header"
        >
          <Bell
            className={cn(totalNotificationLength > 0 && "fill-orange-500")}
          />
          {totalNotificationLength > 0 && (
            <div className="absolute -end-1 -top-1 flex size-4 items-center justify-center rounded-full border border-foreground bg-orange-500 dark:bg-orange-800">
              <span className="text-xs font-extrabold text-foreground">
                {totalNotificationLength}
              </span>
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn(isDarkMode && "dark")}>
        <H4 className="mb-2">Notifications</H4>
        <Separator />
        <div>
          {totalNotificationLength > 0 ? (
            <>
              {notifications.food_item_likes.map((notificationFoodItem) => (
                <NotificationFoodItem
                  key={notificationFoodItem.id + notificationFoodItem.type}
                  notificationFoodItem={notificationFoodItem}
                  handleClick={handleClick}
                />
              ))}
              {notifications.pending_score.map((notificationScore) => (
                <NotificationScorePending
                  notificationScore={notificationScore}
                  key={notificationScore.id + notificationScore.type}
                  handleClick={handleClick}
                />
              ))}
            </>
          ) : (
            <p>You have no notifications.</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default NotificationButton;

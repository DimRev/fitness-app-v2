type SocketMessage = {
  action: MessageActions;
  data?: string;
  group?: string;
};

type MessageActions =
  | "greet"
  | "broadcast-all"
  | "broadcast-group"
  | "broadcast-global"
  | "sign-in"
  | "sign-out"
  | "join-group"
  | "leave-group"
  | "user-notification";

type BroadcastData = {
  group: ConstQueryKeys[];
  action: BroadcastDataAction;
  data: ParamsAsData;
};

type ParamsAsData = {
  limit?: number;
  offset?: number;
  text_filter?: string | null;
  food_item_id?: string;
  meal_id?: string;
};

type BroadcastDataAction = "invalidate";

type UserNotificationBroadcastData = {
  action: UserNotificationDataAction;
  data: {
    title: string;
    description: string;
  };
};

type UserNotificationDataAction = "food-item-pending-got-like";

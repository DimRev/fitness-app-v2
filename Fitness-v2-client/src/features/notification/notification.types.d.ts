type NotificationTypes =
  | "user-like-food-item-pending"
  | "user-score-pending"
  | "user-score-approved"
  | "user-score-rejected";

type NotificationNewFoodItemLikes = {
  id: string;
  food_item_id: string;
  food_item_name: string;
  count: number;
  type: "user-like-food-item-pending";
};

type NotificationNewScore = {
  score: number;
  type: "user-score-pending" | "user-score-approved" | "user-score-rejected";
  id: string;
  title: string;
};

type NotificationsResponse = {
  food_item_likes: NotificationNewFoodItemLikes[];
  pending_score: NotificationNewScore[];
  approved_score: NotificationNewScore[];
  rejected_score: NotificationNewScore[];
};

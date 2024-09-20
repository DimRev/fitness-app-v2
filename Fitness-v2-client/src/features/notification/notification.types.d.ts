type NotificationTypes = "user-like-food-item-pending";

type NotificationNewFoodItemLikes = {
  id: string;
  food_item_id: string;
  food_item_name: string;
  count: number;
  type: NotificationTypes;
};

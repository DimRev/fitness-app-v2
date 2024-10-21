type Props = {
  notificationFoodItem: NotificationNewFoodItemLikes;
  handleClick: (type: NotificationTypes, id: string) => void;
};

function NotificationNewFoodItem({ notificationFoodItem, handleClick }: Props) {
  return (
    <div
      className="text-xs font-bold hover:cursor-pointer"
      onClick={() =>
        handleClick(notificationFoodItem.type, notificationFoodItem.id)
      }
    >
      {`${notificationFoodItem.food_item_name} got ${notificationFoodItem.count} new likes!`}
    </div>
  );
}

export default NotificationNewFoodItem;

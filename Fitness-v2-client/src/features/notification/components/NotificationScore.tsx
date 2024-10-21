type Props = {
  notificationScore: NotificationNewScore;
  handleClick: (type: NotificationTypes, id: string) => void;
};

function NotificationScorePending({ notificationScore, handleClick }: Props) {
  return (
    <div
      className="text-xs font-bold hover:cursor-pointer"
      onClick={() => handleClick(notificationScore.type, notificationScore.id)}
    >
      {`${notificationScore.title} got ${notificationScore.score} points (pending) !`}
    </div>
  );
}

export default NotificationScorePending;

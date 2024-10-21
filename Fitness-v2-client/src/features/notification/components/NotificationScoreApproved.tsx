type Props = {
  notificationScore: NotificationNewScore;
  handleClick: (type: NotificationTypes, id: string) => void;
};

function NotificationScoreApproved({ notificationScore, handleClick }: Props) {
  return (
    <div
      className="text-xs font-bold hover:cursor-pointer"
      onClick={() => handleClick(notificationScore.type, notificationScore.id)}
    >
      {`${notificationScore.title} got approved, added ${notificationScore.score} points!`}
    </div>
  );
}

export default NotificationScoreApproved;

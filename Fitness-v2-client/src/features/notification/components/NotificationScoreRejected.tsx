type Props = {
  notificationScore: NotificationNewScore;
  handleClick: (type: NotificationTypes, id: string) => void;
};

function NotificationScoreRejected({ notificationScore, handleClick }: Props) {
  return (
    <div
      className="text-xs font-bold hover:cursor-pointer"
      onClick={() => handleClick(notificationScore.type, notificationScore.id)}
    >
      {`${notificationScore.title} got rejected, removed ${notificationScore.score} points!`}
    </div>
  );
}

export default NotificationScoreRejected;

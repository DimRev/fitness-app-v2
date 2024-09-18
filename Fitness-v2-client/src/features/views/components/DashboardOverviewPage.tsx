import { LineChart } from "lucide-react";
import DashboardPageWrapper from "./DashboardPageWrapper";
import useSocket from "~/features/socket/useSocket";
import { Button } from "~/features/shared/components/ui/button";
import { useMemo } from "react";
import { SendSocketMessage } from "~/lib/socket";

function DashboardOverviewPage() {
  const { socket } = useSocket();

  const socketStateStr = useMemo(() => {
    if (!socket) return "Not connected";
    switch (socket.readyState) {
      case 0:
        return "Connecting";
      case 1:
        return "Open";
      case 2:
        return "Closing";
      case 3:
        return "Closed";
      default:
        return "Unknown";
    }
  }, [socket]);

  function handleSendMessage() {
    SendSocketMessage({ action: "greet", data: "Hello from client!" }, socket);
  }

  function handleBroadcastMessage() {
    SendSocketMessage(
      { action: "broadcast", data: "Hello from client!" },
      socket,
    );
  }

  function handleBroadcastAllMessage() {
    SendSocketMessage(
      { action: "broadcastAll", data: "Hello from client!" },
      socket,
    );
  }

  return (
    <DashboardPageWrapper
      title="Overview"
      LucideIcon={LineChart}
      to="/dashboard"
    >
      <div>
        <div>{socketStateStr}</div>
        <Button onClick={handleSendMessage}>Greeting message</Button>
        <Button onClick={handleBroadcastMessage}>Broadcast message</Button>
        <Button onClick={handleBroadcastAllMessage}>
          Broadcast all message
        </Button>
      </div>
    </DashboardPageWrapper>
  );
}

export default DashboardOverviewPage;

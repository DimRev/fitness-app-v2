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

  function handleBroadcastGroupMessage() {
    SendSocketMessage(
      { action: "broadcast-group", data: "Hello from client!", group: "test" },
      socket,
    );
  }

  function handleBroadcastAllGroupsMessage() {
    SendSocketMessage(
      { action: "broadcast-all", data: "Hello from client!" },
      socket,
    );
  }

  function handleBroadcastGlobalMessage() {
    SendSocketMessage(
      { action: "broadcast-global", data: "Hello from client!" },
      socket,
    );
  }

  function handleSignIn() {
    SendSocketMessage({ action: "sign-in", data: "test@test.com" }, socket);
  }

  function handleSignOut() {
    SendSocketMessage({ action: "sign-out", data: "" }, socket);
  }

  function handleJoinGroup() {
    SendSocketMessage({ action: "join-group", data: "test" }, socket);
  }

  function handleLeaveGroup() {
    SendSocketMessage({ action: "leave-group", data: "test" }, socket);
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
        <Button onClick={handleBroadcastGroupMessage}>Broadcast message</Button>
        <Button onClick={handleBroadcastAllGroupsMessage}>
          Broadcast all groups message
        </Button>
        <Button onClick={handleBroadcastGlobalMessage}>
          Broadcast all message
        </Button>
        <Button onClick={handleSignIn}>Sign in</Button>
        <Button onClick={handleSignOut}>Sign out</Button>
        <Button onClick={handleJoinGroup}>Join group</Button>
        <Button onClick={handleLeaveGroup}>Leave group</Button>
      </div>
    </DashboardPageWrapper>
  );
}

export default DashboardOverviewPage;

import { LineChart } from "lucide-react";
import DashboardPageWrapper from "./DashboardPageWrapper";
import useSocket from "~/features/socket/useSocket";
import { Button } from "~/features/shared/components/ui/button";
import { useMemo } from "react";

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

  return (
    <DashboardPageWrapper
      title="Overview"
      LucideIcon={LineChart}
      to="/dashboard"
    >
      <div>
        <div>{socketStateStr}</div>
        <Button>Send message</Button>
        <Button>Join Group</Button>
        <Button>Leave Group</Button>
      </div>
    </DashboardPageWrapper>
  );
}

export default DashboardOverviewPage;

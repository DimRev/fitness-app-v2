import { LineChart } from "lucide-react";
import DashboardPageWrapper from "./DashboardPageWrapper";

function DashboardOverviewPage() {
  return (
    <DashboardPageWrapper
      title="Overview"
      LucideIcon={LineChart}
      to="/dashboard"
    >
      <div>Overview</div>
    </DashboardPageWrapper>
  );
}

export default DashboardOverviewPage;

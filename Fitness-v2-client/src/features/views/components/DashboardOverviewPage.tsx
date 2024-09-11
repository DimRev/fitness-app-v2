import { LineChart } from "lucide-react";
import DashboardPageWrapper from "./DashboardPageWrapper";

function DashboardOverviewPage() {
  return (
    <DashboardPageWrapper
      title="Overview"
      LucideIcon={LineChart}
      to="/dashboard"
    >
      <div>This is the overview page</div>
    </DashboardPageWrapper>
  );
}

export default DashboardOverviewPage;

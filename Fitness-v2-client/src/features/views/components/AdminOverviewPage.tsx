import { LineChart } from "lucide-react";
import DashboardPageWrapper from "./DashboardPageWrapper";

function AdminOverviewPage() {
  return (
    <DashboardPageWrapper title="Overview" LucideIcon={LineChart} to="/admin">
      <div>This is the overview page</div>
    </DashboardPageWrapper>
  );
}

export default AdminOverviewPage;

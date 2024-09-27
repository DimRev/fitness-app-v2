import { LineChart } from "lucide-react";
import DashboardPageWrapper from "./DashboardPageWrapper";
import { Helmet } from "react-helmet";

function AdminOverviewPage() {
  return (
    <>
      <Helmet>
        <title>Admin - Overview</title>
      </Helmet>
      <DashboardPageWrapper title="Overview" LucideIcon={LineChart} to="/admin">
        <div>This is the overview page</div>
      </DashboardPageWrapper>
    </>
  );
}

export default AdminOverviewPage;

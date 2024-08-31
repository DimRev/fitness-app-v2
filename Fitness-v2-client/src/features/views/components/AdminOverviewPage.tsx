import { PageHeader } from "~/features/shared/components/Typography";
import DashboardPageWrapper from "./DashboardPageWrapper";
import { LineChart } from "lucide-react";

function AdminOverviewPage() {
  return (
    <DashboardPageWrapper>
      <PageHeader to="/admin" LucideIcon={LineChart}>
        Overview
      </PageHeader>
    </DashboardPageWrapper>
  );
}

export default AdminOverviewPage;

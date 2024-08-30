import { LineChart } from "lucide-react";
import { PageHeader } from "~/features/shared/components/Typography";
import DashboardPageWrapper from "./DashboardPageWrapper";

function DashboardOverviewPage() {
  return (
    <DashboardPageWrapper>
      <PageHeader LucideIcon={LineChart}>Overview</PageHeader>
    </DashboardPageWrapper>
  );
}

export default DashboardOverviewPage;

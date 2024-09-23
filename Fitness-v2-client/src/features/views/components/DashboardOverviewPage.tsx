import { LineChart } from "lucide-react";
import DashboardPageWrapper from "./DashboardPageWrapper";
import ChartMealsConsumed from "~/features/chart/components/ChartMealsConsumed";

function DashboardOverviewPage() {
  return (
    <DashboardPageWrapper
      title="Overview"
      LucideIcon={LineChart}
      to="/dashboard"
    >
      <ChartMealsConsumed />
    </DashboardPageWrapper>
  );
}

export default DashboardOverviewPage;

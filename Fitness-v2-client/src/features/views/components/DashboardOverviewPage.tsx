import { LineChart } from "lucide-react";
import DashboardPageWrapper from "./DashboardPageWrapper";
import ChartMealsConsumed from "~/features/chart/components/ChartMealsConsumed";
import { DashboardContentCards } from "~/features/shared/components/CustomCards";

function DashboardOverviewPage() {
  return (
    <DashboardPageWrapper
      title="Overview"
      LucideIcon={LineChart}
      to="/dashboard"
    >
      <DashboardContentCards title="Charts">
        <div className="gap-4 grid grid-cols-1 lg:grid-cols-2">
          <ChartMealsConsumed />
        </div>
      </DashboardContentCards>
    </DashboardPageWrapper>
  );
}

export default DashboardOverviewPage;

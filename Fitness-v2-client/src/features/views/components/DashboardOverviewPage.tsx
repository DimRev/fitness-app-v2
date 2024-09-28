import { LineChart } from "lucide-react";
import DashboardPageWrapper from "./DashboardPageWrapper";
import ChartMealsConsumed from "~/features/chart/components/ChartMealsConsumed";
import { DashboardContentCards } from "~/features/shared/components/CustomCards";
import { Helmet } from "react-helmet";
import ChartMeasurements from "~/features/chart/components/ChartMeasurements";

function DashboardOverviewPage() {
  return (
    <>
      <Helmet>
        <title>Dashboard - Overview</title>
      </Helmet>
      <DashboardPageWrapper
        title="Overview"
        LucideIcon={LineChart}
        to="/dashboard"
      >
        <DashboardContentCards title="Charts">
          <div className="gap-4 grid grid-cols-1 lg:grid-cols-2">
            <ChartMealsConsumed />
            <ChartMeasurements />
          </div>
        </DashboardContentCards>
      </DashboardPageWrapper>
    </>
  );
}

export default DashboardOverviewPage;

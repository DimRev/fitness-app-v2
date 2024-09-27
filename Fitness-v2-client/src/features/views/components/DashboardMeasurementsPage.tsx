import { Scale } from "lucide-react";
import DashboardPageWrapper from "./DashboardPageWrapper";
import { Helmet } from "react-helmet";

function DashboardMeasurementsPage() {
  return (
    <>
      <Helmet>
        <title>Dashboard - Measurements</title>
      </Helmet>
      <DashboardPageWrapper
        title="Measurements"
        LucideIcon={Scale}
        to="/dashboard/measurement"
      >
        DashboardMeasurementsPage
      </DashboardPageWrapper>
    </>
  );
}

export default DashboardMeasurementsPage;

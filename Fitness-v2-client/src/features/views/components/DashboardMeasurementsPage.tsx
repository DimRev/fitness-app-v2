import { Scale } from "lucide-react";
import DashboardPageWrapper from "./DashboardPageWrapper";

function DashboardMeasurementsPage() {
  return (
    <DashboardPageWrapper
      title="Measurements"
      LucideIcon={Scale}
      to="/dashboard/measurement"
    >
      DashboardMeasurementsPage
    </DashboardPageWrapper>
  );
}

export default DashboardMeasurementsPage;

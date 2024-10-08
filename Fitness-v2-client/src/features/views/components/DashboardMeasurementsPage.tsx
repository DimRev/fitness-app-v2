import { Scale } from "lucide-react";
import DashboardPageWrapper from "./DashboardPageWrapper";
import { Helmet } from "react-helmet";
import MeasurementRecords from "~/features/measurement/components/MeasurementRecords";
import MeasurementLatest from "~/features/measurement/components/MeasurementLatest";

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
        <MeasurementRecords />
        <MeasurementLatest />
      </DashboardPageWrapper>
    </>
  );
}

export default DashboardMeasurementsPage;

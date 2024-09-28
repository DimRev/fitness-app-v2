import { Scale } from "lucide-react";
import { Helmet } from "react-helmet";
import MeasurementAddForm from "~/features/measurement/components/MeasurementAddForm";
import DashboardPageWrapper from "./DashboardPageWrapper";

function DashboardMeasurementsAddPage() {
  return (
    <>
      <Helmet>
        <title>Dashboard - Add Measurements</title>
      </Helmet>
      <DashboardPageWrapper
        title="Add Measurements"
        LucideIcon={Scale}
        to="/dashboard/measurement/add"
      >
        <MeasurementAddForm />
      </DashboardPageWrapper>
    </>
  );
}

export default DashboardMeasurementsAddPage;

import { DashboardContentCards } from "~/features/shared/components/CustomCards";
import useGetCheckTodayMeasurement from "../hooks/useGetCheckTodayMeasurement";
import { Button, buttonVariants } from "~/features/shared/components/ui/button";
import { H3 } from "~/features/shared/components/Typography";
import { Link } from "react-router-dom";

function MeasurementRecords() {
  const { data: measurement, isLoading } = useGetCheckTodayMeasurement({});

  if (isLoading) return <div>Loading...</div>;

  if (!measurement) return <div>No measurements found</div>;

  if (!measurement.isMeasuredToday) {
    return (
      <DashboardContentCards title="Measurements Records">
        <div className="flex justify-between items-center">
          <H3>No recorded measurements today</H3>
          <Link to="/dashboard/measurement/add" className={buttonVariants()}>
            Record measurement
          </Link>
        </div>
      </DashboardContentCards>
    );
  }

  return (
    <DashboardContentCards title="Measurements Records">
      <div className="flex justify-between items-center">
        <H3>Already recorded measurements today</H3>
        <Button disabled>Record measurement</Button>
      </div>
      {measurement.measurement && (
        <>
          <div>Weight: {measurement.measurement?.weight} kg</div>
          <div>Height: {measurement.measurement?.height} cm</div>
          <div>BMI: {measurement.measurement?.bmi}</div>
        </>
      )}
    </DashboardContentCards>
  );
}

export default MeasurementRecords;

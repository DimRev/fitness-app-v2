import { DashboardContentCards } from "~/features/shared/components/CustomCards";
import useGetMeasurementsByUserID from "../hooks/useGetMeasurementsByUserID";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "~/features/shared/components/ui/table";
import { Skeleton } from "~/features/shared/components/ui/skeleton";

function MeasurementLatest() {
  const { data: measurements, isLoading } = useGetMeasurementsByUserID({});

  if (isLoading) {
    return (
      <DashboardContentCards title="Latest Measurements">
        <Table>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Weight (kg)</TableHead>
            <TableHead>Height (m)</TableHead>
            <TableHead>BMI</TableHead>
          </TableRow>
          <TableBody>
            {Array.from({ length: 5 }).map((_, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  <Skeleton className="w-full h-[19.5px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-full h-[19.5px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-full h-[19.5px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-full h-[19.5px]" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DashboardContentCards>
    );
  }

  if (!measurements) {
    return (
      <DashboardContentCards title="Latest Measurements">
        <Table>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Weight (kg)</TableHead>
            <TableHead>Height (m)</TableHead>
            <TableHead>BMI</TableHead>
          </TableRow>
          <TableBody>
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No measurements found
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DashboardContentCards>
    );
  }

  return (
    <DashboardContentCards title="Latest Measurements">
      <Table>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Weight (kg)</TableHead>
          <TableHead>Height (m)</TableHead>
          <TableHead>BMI</TableHead>
        </TableRow>
        <TableBody>
          {measurements?.map((measurement, idx) => (
            <TableRow key={measurement.date + idx}>
              <TableCell>
                {new Date(measurement.date).toLocaleDateString("en-US", {
                  dateStyle: "medium",
                })}
              </TableCell>
              <TableCell>{measurement.weight}</TableCell>
              <TableCell>{measurement.height}</TableCell>
              <TableCell>{measurement.bmi}</TableCell>
            </TableRow>
          ))}
          {new Array(5 - measurements.length).fill(null).map((_, idx) => (
            <TableRow key={idx}>
              <TableCell>
                <div className="w-full h-[19.5px]"></div>
              </TableCell>
              <TableCell>
                <div className="w-full h-[19.5px]"></div>
              </TableCell>
              <TableCell>
                <div className="w-full h-[19.5px]"></div>
              </TableCell>
              <TableCell>
                <div className="w-full h-[19.5px]"></div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DashboardContentCards>
  );
}

export default MeasurementLatest;

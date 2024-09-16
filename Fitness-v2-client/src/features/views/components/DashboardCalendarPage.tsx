import { Calendar } from "lucide-react";
import DashboardPageWrapper from "./DashboardPageWrapper";
import CalendarMain from "~/features/calendar/components/CalendarMain";

function DashboardCalendarPage() {
  return (
    <DashboardPageWrapper
      title="Calendar"
      LucideIcon={Calendar}
      to="/dashboard/calendar"
      iconClasses="fill-cyan-500 dark:fill-cyan-700"
    >
      <CalendarMain />
    </DashboardPageWrapper>
  );
}

export default DashboardCalendarPage;

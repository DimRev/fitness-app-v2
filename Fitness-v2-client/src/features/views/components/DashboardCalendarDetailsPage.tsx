import { Calendar, Loader2 } from "lucide-react";
import { useMemo } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";
import DashboardPageWrapper from "./DashboardPageWrapper";
import CalendarDetailsContent from "~/features/calendar/components/CalendarDetailsContent";
import useLayoutStore from "~/features/layout/hooks/useLayoutStore";

function DashboardCalendarDetailsPage() {
  const { dateStr } = useParams();

  const navigate = useNavigate();
  const { isDarkMode } = useLayoutStore();

  const fmtDateStr = useMemo(() => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toDateString();
  }, [dateStr]);

  if (!dateStr || fmtDateStr === "Invalid Date") {
    navigate("/not_found");
    return (
      <div
        className={`flex items-center justify-center ${isDarkMode && "dark"}`}
      >
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - Date - {fmtDateStr}</title>
      </Helmet>
      <DashboardPageWrapper
        title="Calendar"
        LucideIcon={Calendar}
        to="/dashboard/calendar"
        iconClasses="fill-cyan-500 dark:fill-cyan-700"
      >
        <CalendarDetailsContent dateStr={dateStr} />
      </DashboardPageWrapper>
    </>
  );
}

export default DashboardCalendarDetailsPage;

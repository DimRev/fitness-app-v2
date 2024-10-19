import { Coins } from "lucide-react";
import { Helmet } from "react-helmet";
import DashboardPageWrapper from "./DashboardPageWrapper";
import ScoreSummery from "~/features/score/components/ScoreSummery";

function DashboardScorePage() {
  return (
    <>
      <Helmet>
        <title>Dashboard - Score</title>
      </Helmet>
      <DashboardPageWrapper
        title="Score"
        LucideIcon={Coins}
        to="/dashboard/score"
        iconClasses="fill-yellow-300 dark:fill-yellow-500"
      >
        <ScoreSummery />
      </DashboardPageWrapper>
    </>
  );
}

export default DashboardScorePage;

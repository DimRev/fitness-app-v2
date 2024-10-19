import { BadgeCheckIcon, BadgeHelp, BadgePlus } from "lucide-react";
import { DashboardContentCards } from "~/features/shared/components/CustomCards";
import ScoreBadge from "./ScoreBadge";
import { useGetScoreByUserID } from "../hooks/useGetScoreByUserID";
import { Card } from "~/features/shared/components/ui/card";

function ScoreSummery() {
  const {
    data: score,
    isLoading,
    error,
    isError,
    refetch,
  } = useGetScoreByUserID();

  if (isLoading) {
    return (
      <DashboardContentCards>
        <div className="grid grid-cols-3 items-center gap-4">
          <ScoreBadge
            LucideIcon={BadgePlus}
            score="..."
            title="Total Score"
            cardClassName="dark:bg-green-900 bg-green-400"
            headerClassName="dark:text-green-400 text-green-900"
            contentClassName="text-muted-foreground"
            iconClassName="dark:text-green-400 text-green-900"
          />
          <ScoreBadge
            LucideIcon={BadgeHelp}
            score="..."
            title="Pending Score"
            cardClassName="dark:bg-orange-900 bg-orange-400"
            headerClassName="dark:text-orange-400 text-orange-900"
            contentClassName="text-muted-foreground"
            iconClassName="dark:text-orange-400 text-orange-900"
          />
          <ScoreBadge
            LucideIcon={BadgeCheckIcon}
            score="..."
            title="Approved Score"
            cardClassName="dark:bg-green-800 bg-green-400"
            headerClassName="dark:text-green-400 text-green-800"
            contentClassName="text-muted-foreground"
            iconClassName="dark:text-green-400 text-green-800"
          />
        </div>
      </DashboardContentCards>
    );
  }

  if (isError || !score) {
    return (
      <DashboardContentCards>
        <Card className="py-2 text-center">
          <h3 className="text-lg font-semibold">Unable to load score data</h3>
          <p className="text-muted-foreground">
            {error?.message ?? "An unknown error occurred"}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground"
          >
            Retry
          </button>
        </Card>
      </DashboardContentCards>
    );
  }

  return (
    <DashboardContentCards>
      <div className="grid grid-cols-3 items-center gap-4">
        <ScoreBadge
          LucideIcon={BadgePlus}
          score={`${score.total_score}`}
          title="Total Score"
          cardClassName="dark:bg-green-900 bg-green-400"
          headerClassName="dark:text-green-400 text-green-900"
          contentClassName="text-muted-foreground"
          iconClassName="dark:text-green-400 text-green-900"
        />
        <ScoreBadge
          LucideIcon={BadgeHelp}
          score={`${score.pending_score}`}
          title="Pending Score"
          cardClassName="dark:bg-orange-900 bg-orange-400"
          headerClassName="dark:text-orange-400 text-orange-900"
          contentClassName="text-muted-foreground"
          iconClassName="dark:text-orange-400 text-orange-900"
        />
        <ScoreBadge
          LucideIcon={BadgeCheckIcon}
          score={`${score.approved_score}`}
          title="Approved Score"
          cardClassName="dark:bg-green-800 bg-green-400"
          headerClassName="dark:text-green-400 text-green-800"
          contentClassName="text-muted-foreground"
          iconClassName="dark:text-green-400 text-green-800"
        />
      </div>
    </DashboardContentCards>
  );
}

export default ScoreSummery;

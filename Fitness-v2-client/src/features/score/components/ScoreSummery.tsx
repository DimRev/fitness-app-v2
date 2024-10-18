import { BadgeCheckIcon, BadgeHelp, BadgePlus } from "lucide-react";
import { DashboardContentCards } from "~/features/shared/components/CustomCards";
import ScoreBadge from "./ScoreBadge";

function ScoreSummery() {
  return (
    <DashboardContentCards>
      <div className="grid grid-cols-3 items-center gap-4">
        <ScoreBadge
          LucideIcon={BadgePlus}
          score="1500"
          title="Total Score"
          cardClassName="dark:bg-green-900 bg-green-400"
          headerClassName="dark:text-green-400 text-green-900"
          contentClassName="text-muted-foreground"
          iconClassName="dark:text-green-400 text-green-900"
        />
        <ScoreBadge
          LucideIcon={BadgeHelp}
          score="1000"
          title="Pending Score"
          cardClassName="dark:bg-orange-900 bg-orange-400"
          headerClassName="dark:text-orange-400 text-orange-900"
          contentClassName="text-muted-foreground"
          iconClassName="dark:text-orange-400 text-orange-900"
        />
        <ScoreBadge
          LucideIcon={BadgeCheckIcon}
          score="500"
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

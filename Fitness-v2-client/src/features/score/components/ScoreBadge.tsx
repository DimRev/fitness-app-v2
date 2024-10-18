import { type LucideIcon } from "lucide-react";
import { H3 } from "~/features/shared/components/Typography";
import { Card } from "~/features/shared/components/ui/card";
import { Separator } from "~/features/shared/components/ui/separator";
import { cn } from "~/lib/utils";

type Props = {
  title: string;
  score: string;
  LucideIcon: LucideIcon;
  cardClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
  iconClassName?: string;
};

function ScoreBadge({
  title,
  score,
  LucideIcon,
  headerClassName,
  contentClassName,
  cardClassName,
  iconClassName,
}: Props) {
  return (
    <Card
      className={cn(
        "flex flex-col items-center justify-center gap-2 py-2",
        cardClassName,
      )}
    >
      <H3
        className={cn(
          "line-clamp, LucideIcon-1 flex items-center gap-2 px-2 max-xl:text-xs max-md:hidden xl:text-lg",
          headerClassName,
        )}
      >
        <LucideIcon className={cn(iconClassName)} />
        <span className={cn(headerClassName)}>{title}</span>
      </H3>
      <LucideIcon className={cn("md:hidden", iconClassName)} />
      <Separator />
      <H3
        className={cn(
          "tracking-wider sm:text-base md:text-lg lg:text-2xl xl:text-4xl",
          contentClassName,
        )}
      >
        {score}
      </H3>
    </Card>
  );
}

export default ScoreBadge;

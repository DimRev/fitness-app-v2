import { type LucideIcon } from "lucide-react";
import React from "react";
import useLayoutStore from "~/features/layout/hooks/useLayoutStore";
import { PageHeader } from "~/features/shared/components/Typography";
import { ScrollArea } from "~/features/shared/components/ui/scroll-area";
import { cn } from "~/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  LucideIcon: LucideIcon;
  title: string;
  to: string;
  iconClasses?: string;
};

function DashboardPageWrapper({
  children,
  className,
  LucideIcon,
  title,
  iconClasses,
  to,
}: Props) {
  const { isSidebarOpen } = useLayoutStore();

  return (
    <div
      className={cn(
        "flex h-main flex-col gap-4",
        isSidebarOpen ? "w-dashboard-md md:w-dashboard-lg" : "w-dashboard-sm",
        className,
      )}
    >
      <PageHeader to={to} LucideIcon={LucideIcon} iconClasses={iconClasses}>
        {title}
      </PageHeader>
      <div className="rounded-lg border border-muted/70">
        <ScrollArea
          className={cn(
            "relative h-main-content rounded-lg p-2",
            isSidebarOpen
              ? "w-dashboard-md md:w-dashboard-lg"
              : "w-dashboard-sm",
          )}
        >
          {children}
        </ScrollArea>
      </div>
    </div>
  );
}

export default DashboardPageWrapper;

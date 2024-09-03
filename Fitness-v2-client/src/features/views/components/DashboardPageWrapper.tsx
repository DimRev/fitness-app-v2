import { SidebarOpen, type LucideIcon } from "lucide-react";
import React from "react";
import useLayoutStore from "~/features/layout/hooks/useLayoutStore";
import { PageHeader } from "~/features/shared/components/Typography";
import { Card } from "~/features/shared/components/ui/card";
import { ScrollArea } from "~/features/shared/components/ui/scroll-area";
import { cn } from "~/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  LucideIcon: LucideIcon;
  title: string;
  to: string;
};

function DashboardPageWrapper({
  children,
  className,
  LucideIcon,
  title,
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
      <PageHeader to={to} LucideIcon={LucideIcon}>
        {title}
      </PageHeader>
      <Card className="border-2 border-black">
        <ScrollArea
          className={cn(
            "h-main-content p-4",
            isSidebarOpen
              ? "w-dashboard-md md:w-dashboard-lg"
              : "w-dashboard-sm",
          )}
        >
          {children}
        </ScrollArea>
      </Card>
    </div>
  );
}

export default DashboardPageWrapper;

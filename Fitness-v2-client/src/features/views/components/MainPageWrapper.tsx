import { type LucideIcon } from "lucide-react";
import React from "react";
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

function MainPageWrapper({
  children,
  className,
  LucideIcon,
  title,
  to,
}: Props) {
  return (
    <div className={cn("container flex h-main flex-col gap-4", className)}>
      <PageHeader to={to} LucideIcon={LucideIcon}>
        {title}
      </PageHeader>
      <Card className="border-2 border-black">
        <ScrollArea className="h-main-content container">{children}</ScrollArea>
      </Card>
    </div>
  );
}

export default MainPageWrapper;

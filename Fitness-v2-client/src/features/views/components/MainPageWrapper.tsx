import { type LucideIcon } from "lucide-react";
import React from "react";
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

function MainPageWrapper({
  children,
  className,
  LucideIcon,
  title,
  to,
  iconClasses,
}: Props) {
  return (
    <div className={cn("container flex h-main flex-col gap-4", className)}>
      <PageHeader to={to} LucideIcon={LucideIcon} iconClasses={iconClasses}>
        {title}
      </PageHeader>
      <div className="border-muted/70 border rounded-lg">
        <ScrollArea className="h-main-content container">{children}</ScrollArea>
      </div>
    </div>
  );
}

export default MainPageWrapper;

import React from "react";
import { cn } from "~/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
};

function MainPageWrapper({ children, className }: Props) {
  return (
    <div className={cn("h-main overflow-y-auto pt-4", className)}>
      <div className="container">{children}</div>
    </div>
  );
}

export default MainPageWrapper;

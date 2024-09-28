import { type ReactNode } from "react";
import { H2 } from "./Typography";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import useLayoutStore from "~/features/layout/hooks/useLayoutStore";
import { cn } from "~/lib/utils";

type Props = {
  title: string;
  children?: ReactNode;
  footerChildren?: ReactNode;
};

export function DashboardContentCards({
  title,
  children,
  footerChildren,
}: Props) {
  const { isSidebarOpen } = useLayoutStore();

  return (
    <Card
      className={cn(
        "border-2 border-foreground [&:not(:first-child)]:mt-4",
        isSidebarOpen
          ? "w-dashboard-card-md md:w-dashboard-card-lg"
          : "w-dashboard-card-sm",
      )}
    >
      <CardHeader>
        <H2 className="border-b">{title}</H2>
      </CardHeader>
      {children && <CardContent>{children}</CardContent>}
      {footerChildren && <CardFooter>{footerChildren}</CardFooter>}
    </Card>
  );
}

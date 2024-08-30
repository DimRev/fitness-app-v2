import { type ReactNode } from "react";
import { H2 } from "./Typography";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

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
  return (
    <Card className="border-2 border-foreground">
      <CardHeader>
        <H2 className="border-b">{title}</H2>
      </CardHeader>
      {children && <CardContent>{children}</CardContent>}
      {footerChildren && <CardFooter>{footerChildren}</CardFooter>}
    </Card>
  );
}

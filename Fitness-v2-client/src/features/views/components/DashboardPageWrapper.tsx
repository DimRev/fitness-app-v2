import { type ReactNode } from "react";

type Props = { children: ReactNode };

function DashboardPageWrapper({ children }: Props) {
  return <div className="flex flex-col gap-2 px-4 pt-4">{children}</div>;
}

export default DashboardPageWrapper;

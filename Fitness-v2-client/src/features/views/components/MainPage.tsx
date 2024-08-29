import React from "react";

type Props = {
  children: React.ReactNode;
};

function MainPageWrapper({ children }: Props) {
  return <div className="h-main overflow-y-scroll">{children}</div>;
}

export default MainPageWrapper;

import { PageHeader } from "~/features/shared/components/Typography";
import MainPageWrapper from "./MainPageWrapper";
import { Home } from "lucide-react";

function HomePage() {
  return (
    <MainPageWrapper>
      <PageHeader LucideIcon={Home}>Home Page</PageHeader>
    </MainPageWrapper>
  );
}

export default HomePage;

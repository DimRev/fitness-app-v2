import { PageHeader } from "~/features/shared/components/Typography";
import MainPageWrapper from "./MainPageWrapper";
import { Home } from "lucide-react";

function HomePage() {
  return (
    <MainPageWrapper LucideIcon={Home} title="Home Page" to="/">
      <div>This is the home page</div>
    </MainPageWrapper>
  );
}

export default HomePage;

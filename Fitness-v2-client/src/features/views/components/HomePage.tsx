import { Home } from "lucide-react";
import MainPageWrapper from "./MainPageWrapper";

function HomePage() {
  return (
    <MainPageWrapper LucideIcon={Home} title="Home Page" to="/">
      <div>This is the home page</div>
    </MainPageWrapper>
  );
}

export default HomePage;

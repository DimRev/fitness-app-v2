import { Home } from "lucide-react";
import MainPageWrapper from "./MainPageWrapper";
import { Helmet } from "react-helmet";

function HomePage() {
  return (
    <>
      <Helmet>
        <title>Fitness App</title>
      </Helmet>
      <MainPageWrapper LucideIcon={Home} title="Home Page" to="/">
        <div>This is the home page</div>
      </MainPageWrapper>
    </>
  );
}

export default HomePage;

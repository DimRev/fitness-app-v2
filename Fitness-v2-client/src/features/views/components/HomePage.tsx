import { Home } from "lucide-react";
import MainPageWrapper from "./MainPageWrapper";
import { Helmet } from "react-helmet";
import HomeContent from "~/features/home/components/HomeContent";

function HomePage() {
  return (
    <>
      <Helmet>
        <title>Fitness App</title>
      </Helmet>
      <MainPageWrapper LucideIcon={Home} title="Home Page" to="/">
        <HomeContent />
      </MainPageWrapper>
    </>
  );
}

export default HomePage;

import { Info } from "lucide-react";
import MainPageWrapper from "./MainPageWrapper";
import { Helmet } from "react-helmet";

function AboutPage() {
  return (
    <>
      <Helmet>
        <title>Fitness App - About</title>
      </Helmet>
      <MainPageWrapper
        LucideIcon={Info}
        title="About Page"
        to="/about"
        iconClasses="fill-blue-500 dark:fill-blue-600"
      >
        <div>This is the about page</div>
      </MainPageWrapper>
    </>
  );
}

export default AboutPage;

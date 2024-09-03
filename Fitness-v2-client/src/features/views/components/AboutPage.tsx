import { Info } from "lucide-react";
import MainPageWrapper from "./MainPageWrapper";

function AboutPage() {
  return (
    <MainPageWrapper LucideIcon={Info} title="About Page" to="/about">
      <div>This is the about page</div>
    </MainPageWrapper>
  );
}

export default AboutPage;

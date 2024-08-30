import { PageHeader } from "~/features/shared/components/Typography";
import MainPageWrapper from "./MainPageWrapper";
import { Info } from "lucide-react";

function AboutPage() {
  return (
    <MainPageWrapper>
      <PageHeader to="/about" LucideIcon={Info}>
        About Page
      </PageHeader>
    </MainPageWrapper>
  );
}

export default AboutPage;

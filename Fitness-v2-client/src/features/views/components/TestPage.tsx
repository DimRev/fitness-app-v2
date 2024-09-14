import { cn } from "~/lib/utils";
import MainPageWrapper from "./MainPageWrapper";
import { Info } from "lucide-react";
import AvatarImageInput from "~/features/shared/components/AvatarImageInput";

function TestPage() {
  return (
    <MainPageWrapper LucideIcon={Info} title="Test Page" to="/test">
      <TestCard title="Color Palette | Background & Foreground">
        <DarkLightColorCards
          title="Primary"
          colorClasses="bg-primary text-primary-foreground"
        />
        <DarkLightColorCards
          title="Secondary"
          colorClasses="bg-secondary text-secondary-foreground"
        />
        <DarkLightColorCards
          title="Destructive"
          colorClasses="bg-destructive text-destructive-foreground"
        />
        <DarkLightColorCards
          title="Muted"
          colorClasses="bg-muted text-muted-foreground"
        />
        <DarkLightColorCards
          title="Accent"
          colorClasses="bg-accent text-accent-foreground"
        />
        <DarkLightColorCards
          title="Popover"
          colorClasses="bg-popover text-popover-foreground"
        />
        <DarkLightColorCards
          title="Card"
          colorClasses="bg-card text-card-foreground"
        />
        <DarkLightColorCards
          title="Header"
          colorClasses="bg-header text-header-foreground"
        />
        <DarkLightColorCards
          title="Sidebar"
          colorClasses="bg-sidebar text-sidebar-foreground"
        />
      </TestCard>
      <TestCard title="Color Palette | Only Background">
        <DarkLightColorCards
          title="Background"
          colorClasses="bg-background text-foreground"
        />
        <DarkLightColorCards
          title="Foreground"
          colorClasses="bg-foreground text-muted"
        />
        <DarkLightColorCards
          title="Input"
          colorClasses="bg-input text-foreground"
        />
        <DarkLightColorCards
          title="Border"
          colorClasses="bg-border text-foreground"
        />
        <DarkLightColorCards
          title="Ring"
          colorClasses="bg-ring text-foreground"
        />
      </TestCard>

      <AvatarImageInput />
    </MainPageWrapper>
  );
}

type TestCardProps = {
  title: string;
  children: React.ReactNode;
};
function TestCard({ title, children }: TestCardProps) {
  return (
    <div className="flex flex-col gap-2 border-t font-bold">
      <h2 className="text-center text-lg">{title}</h2>
      <div className="flex flex-wrap justify-center gap-4 py-2 border-b font-bold">
        {children}
      </div>
    </div>
  );
}

type DuelColorCardProps = {
  title: string;
  colorClasses: string;
};

function DarkLightColorCards({ title, colorClasses }: DuelColorCardProps) {
  return (
    <div className="flex gap-2 border-2 p-1 border-black">
      <div
        className={cn("flex size-36 items-center justify-center", colorClasses)}
      >
        {title}
      </div>
      <div
        className={cn(
          "dark flex size-36 items-center justify-center",
          colorClasses,
        )}
      >
        {title} Dark
      </div>
    </div>
  );
}

export default TestPage;

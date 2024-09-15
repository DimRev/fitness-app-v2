import { Info } from "lucide-react";
import { Button } from "~/features/shared/components/ui/button";
import { cn } from "~/lib/utils";
import MainPageWrapper from "./MainPageWrapper";
import { toast } from "sonner";

function TestPage() {
  function handleDefaultSonner() {
    toast.success("This is a success sonner", {
      dismissible: true,
    });
  }

  function handleDestructiveSonner() {
    toast.error("This is a destructive sonner", {
      dismissible: true,
    });
  }

  function handleWarningSonner() {
    toast.warning("This is a warning sonner", {
      dismissible: true,
    });
  }

  function handleInfoSonner() {
    toast.info("This is a info sonner", {
      dismissible: true,
    });
  }

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
      <TestCard title="Toast & Sonners">
        <Button onClick={handleDefaultSonner}>Success Toast</Button>
        <Button onClick={handleDestructiveSonner}>Destructive Toast</Button>
        <Button onClick={handleWarningSonner}>Warning Toast</Button>
        <Button onClick={handleInfoSonner}>Info Toast</Button>
      </TestCard>
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
      <div className="flex flex-wrap justify-center gap-4 border-b py-2 font-bold">
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
    <div className="flex gap-2 border-2 border-black p-1">
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

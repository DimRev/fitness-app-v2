function TestPage() {
  return (
    <div className="h-main">
      <h2>Color Palette | Background & Foreground</h2>
      <div className="flex flex-wrap justify-center gap-4 font-bold">
        <div className="flex gap-2 border-2 p-1 border-black">
          <div className="flex justify-center items-center bg-primary text-primary-foreground size-36">
            Primary
          </div>
          <div className="flex justify-center items-center bg-primary text-primary-foreground dark size-36">
            Primary Dark
          </div>
        </div>
        <div className="flex gap-2 border-2 p-1 border-black">
          <div className="flex justify-center items-center bg-secondary text-secondary-foreground size-36">
            Secondary
          </div>
          <div className="flex justify-center items-center bg-secondary text-secondary-foreground dark size-36">
            Secondary Dark
          </div>
        </div>
        <div className="flex gap-2 border-2 p-1 border-black">
          <div className="flex justify-center items-center bg-destructive text-destructive-foreground size-36">
            Destructive
          </div>
          <div className="dark: flex justify-center items-center bg-destructive text-destructive-foreground size-36">
            Destructive Dark
          </div>
        </div>
        <div className="flex gap-2 border-2 p-1 border-black">
          <div className="flex justify-center items-center bg-muted text-muted-foreground size-36">
            Muted
          </div>
          <div className="flex justify-center items-center bg-muted text-muted-foreground dark size-36">
            Muted Dark
          </div>
        </div>
        <div className="flex gap-2 border-2 p-1 border-black">
          <div className="flex justify-center items-center bg-accent text-accent-foreground size-36">
            Accent
          </div>
          <div className="flex justify-center items-center bg-accent text-accent-foreground dark size-36">
            Accent Dark
          </div>
        </div>
        <div className="flex gap-2 border-2 p-1 border-black">
          <div className="flex justify-center items-center bg-popover text-popover-foreground size-36">
            Popover
          </div>
          <div className="flex justify-center items-center bg-popover text-popover-foreground dark size-36">
            Popover Dark
          </div>
        </div>
        <div className="flex gap-2 border-2 p-1 border-black">
          <div className="flex justify-center items-center bg-card text-card-foreground size-36">
            Card
          </div>
          <div className="flex justify-center items-center bg-card text-card-foreground dark size-36">
            Card Dark
          </div>
        </div>
        <div className="flex gap-2 border-2 p-1 border-black">
          <div className="flex justify-center items-center bg-header text-header-foreground size-36">
            Header
          </div>
          <div className="flex justify-center items-center bg-header text-header-foreground dark size-36">
            Header Dark
          </div>
        </div>
        <div className="flex gap-2 border-2 p-1 border-black">
          <div className="flex justify-center items-center bg-sidebar text-sidebar-foreground size-36">
            Sidebar
          </div>
          <div className="flex justify-center items-center bg-sidebar text-sidebar-foreground dark size-36">
            Sidebar Dark
          </div>
        </div>
      </div>
      <h2>Color Palette | Only Background</h2>
      <div className="flex flex-wrap justify-center gap-4">
        <div className="flex gap-2 border-2 p-1 border-black">
          <div className="flex justify-center items-center border-2 bg-background border-black rounded-md size-36">
            Background
          </div>
          <div className="flex justify-center items-center border-2 bg-background border-black rounded-md text-white dark size-36">
            Background Dark
          </div>
        </div>
        <div className="flex gap-2 border-2 p-1 border-black">
          <div className="flex justify-center items-center border-2 bg-foreground border-black rounded-md text-white size-36">
            Foreground
          </div>
          <div className="flex justify-center items-center border-2 bg-foreground border-black rounded-md dark size-36">
            Foreground Dark
          </div>
        </div>
        <div className="flex gap-2 border-2 p-1 border-black">
          <div className="flex justify-center items-center border-2 bg-input border-black rounded-md size-36">
            Input
          </div>
          <div className="flex justify-center items-center border-2 bg-input border-black rounded-md text-white dark size-36">
            Input Dark
          </div>
        </div>
        <div className="flex gap-2 border-2 p-1 border-black">
          <div className="flex justify-center items-center border-2 bg-border border-black rounded-md size-36">
            Border
          </div>
          <div className="flex justify-center items-center border-2 bg-border border-black rounded-md text-white dark size-36">
            Border Dark
          </div>
        </div>
        <div className="flex gap-2 border-2 p-1 border-black">
          <div className="flex justify-center items-center border-2 border-black rounded-md bg-ring size-36">
            Ring
          </div>
          <div className="flex justify-center items-center border-2 border-black rounded-md bg-ring dark size-36">
            Ring Dark
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestPage;

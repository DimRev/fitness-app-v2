import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { buttonVariants } from "~/features/shared/components/ui/button";

function SidebarDashboard() {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");
    setIsSmallScreen(mediaQuery.matches);

    const handleResize = (e: MediaQueryListEvent) => {
      setIsSmallScreen(e.matches);
    };
    mediaQuery.addEventListener("change", handleResize);
    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  if (isSmallScreen) {
    return (
      <nav className="flex flex-col items-center gap-2 pt-2">
        <Link
          to="/dashboard"
          className={buttonVariants({ variant: "outline", size: "icon" })}
        >
          <Search className="size-5" />
        </Link>
      </nav>
    );
  }

  return (
    <nav className="relative flex flex-col items-start gap-2 px-2 pt-2">
      <Link
        to="/dashboard"
        className={buttonVariants({
          variant: "outline",
          className: "grid w-full grid-cols-[auto_1fr]",
        })}
      >
        <Search className="me-4 size-4" />
        <span>Overview</span>
      </Link>
      <Link
        to="/dashboard"
        className={buttonVariants({
          variant: "outline",
          className: "grid w-full grid-cols-[auto_1fr]",
        })}
      >
        <Search className="me-4 size-4" />
        <span>Overview</span>
      </Link>
      <Link
        to="/dashboard"
        className={buttonVariants({
          variant: "outline",
          className: "grid w-full grid-cols-[auto_1fr]",
        })}
      >
        <Search className="me-4 size-4" />
        <span>Overview</span>
      </Link>
    </nav>
  );
}

export default SidebarDashboard;

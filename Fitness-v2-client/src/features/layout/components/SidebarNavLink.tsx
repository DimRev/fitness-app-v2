import { type LucideIcon } from "lucide-react";
import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { buttonVariants } from "~/features/shared/components/ui/button";
import { cn } from "~/lib/utils";

type Props = {
  to: string;
  title: string;
  LucideIcon: LucideIcon;
  onlyIcon?: boolean;
};

function SidebarNavLink({ to, title, LucideIcon, onlyIcon }: Props) {
  const location = useLocation();
  const isActive = useMemo(() => {
    const LocationLen = location.pathname.split("/").length;
    const toLen = to.split("/").length;
    if (LocationLen === 2 || toLen === 2) {
      return location.pathname === to;
    } else {
      return location.pathname.startsWith(to);
    }
  }, [location.pathname, to]);

  if (onlyIcon) {
    return (
      <Link
        to={to}
        className={buttonVariants({
          variant: "outline",
          size: "icon",
          className: cn(
            "border-foreground bg-sidebar hover:bg-violet-300 dark:hover:bg-violet-800",
            isActive &&
              "bg-amber-400 text-muted hover:bg-amber-300 hover:text-muted/90 dark:bg-yellow-500 dark:hover:bg-yellow-400",
          ),
        })}
      >
        <LucideIcon className="size-5" />
      </Link>
    );
  }

  return (
    <Link
      to={to}
      className={buttonVariants({
        variant: "outline",
        className: cn(
          "grid w-full grid-cols-[auto_1fr] border-foreground bg-sidebar hover:bg-violet-300 dark:hover:bg-violet-800",
          isActive &&
            "bg-amber-400 text-muted hover:bg-amber-300 hover:text-muted/90 dark:bg-yellow-500 dark:hover:bg-yellow-400",
        ),
      })}
    >
      <LucideIcon className="me-4 size-4" />
      {!onlyIcon && <span>{title}</span>}
    </Link>
  );
}

export default SidebarNavLink;

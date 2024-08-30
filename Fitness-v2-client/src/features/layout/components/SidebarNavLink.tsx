import { type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { buttonVariants } from "~/features/shared/components/ui/button";

type Props = {
  to: string;
  title: string;
  LucideIcon: LucideIcon;
  onlyIcon?: boolean;
};

function SidebarNavLink({ to, title, LucideIcon, onlyIcon }: Props) {
  if (onlyIcon) {
    return (
      <Link
        to={to}
        className={buttonVariants({
          variant: "outline",
          size: "icon",
          className: "border-foreground bg-sidebar",
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
        className:
          "grid w-full grid-cols-[auto_1fr] border-foreground bg-sidebar",
      })}
    >
      <LucideIcon className="me-4 size-4" />
      {!onlyIcon && <span>{title}</span>}
    </Link>
  );
}

export default SidebarNavLink;

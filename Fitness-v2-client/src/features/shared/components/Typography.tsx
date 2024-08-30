import { LucideIcon } from "lucide-react";
import { type ReactNode } from "react";
import { cn } from "~/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLHeadingElement>;

export function H1({ children, className, ...props }: Props) {
  return (
    <h1
      className={cn("text-3xl font-extrabold tracking-wide", className)}
      {...props}
    >
      {children}
    </h1>
  );
}

export function H2({ children, className, ...props }: Props) {
  return (
    <h2 className={cn("text-2xl font-bold", className)} {...props}>
      {children}
    </h2>
  );
}

export function H3({ children, className, ...props }: Props) {
  return (
    <h3 className={cn("text-xl font-bold", className)} {...props}>
      {children}
    </h3>
  );
}

export function H4({ children, className, ...props }: Props) {
  return (
    <h4 className={cn(className)} {...props}>
      {children}
    </h4>
  );
}

export function H5({ children, className, ...props }: Props) {
  return (
    <h5 className={cn(className)} {...props}>
      {children}
    </h5>
  );
}

export function H6({ children, className, ...props }: Props) {
  return (
    <h6 className={cn(className)} {...props}>
      {children}
    </h6>
  );
}

export function P({ children, className, ...props }: Props) {
  return (
    <p className={cn(className)} {...props}>
      {children}
    </p>
  );
}

interface PageHeaderProps extends Props {
  LucideIcon: LucideIcon;
}

export function PageHeader({
  children,
  className,
  LucideIcon,
  ...props
}: PageHeaderProps) {
  return (
    <div className="flex justify-between items-center border-2 border-foreground px-5 py-4 rounded-md">
      <H1 {...props}>{children}</H1>
      <LucideIcon className="size-7" />
    </div>
  );
}

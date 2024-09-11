import { type LucideIcon, Slash } from "lucide-react";
import React, { useMemo, type ReactNode } from "react";
import { cn } from "~/lib/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Link } from "react-router-dom";

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
    <h3 className={cn("text-lg font-bold", className)} {...props}>
      {children}
    </h3>
  );
}

export function H4({ children, className, ...props }: Props) {
  return (
    <h4
      className={cn(
        className,
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      )}
      {...props}
    >
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
  to: string;
  iconClasses?: string;
}

export function PageHeader({
  children,
  LucideIcon,
  to,
  iconClasses,
  ...props
}: PageHeaderProps) {
  const toRoutes = useMemo(() => {
    const routesArr = to.split("/").slice(1);
    return routesArr.map((path, idx) => ({
      path: routesArr.slice(0, idx + 1).join("/"),
      title:
        path === ""
          ? "Home"
          : path
              .split("_")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" "),
    }));
  }, [to]);

  return (
    <div className="mt-4 rounded-md border-2 border-foreground bg-popover stroke-popover-foreground px-5 py-4 text-popover-foreground">
      <div className="flex items-center justify-between border-b">
        <H1 className="truncate" {...props}>
          {children}
        </H1>
        <LucideIcon className={cn("size-7", iconClasses)} />
      </div>
      <div className="py-2">
        <Breadcrumb>
          <BreadcrumbList>
            {toRoutes.map((route, idx) => {
              if (idx < toRoutes.length - 1)
                return (
                  <React.Fragment key={route.path + idx}>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link
                          className="font-semibold text-blue-500 hover:text-blue-700"
                          to={`/${route.path}`}
                        >
                          {route.title}
                        </Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                      <Slash />
                    </BreadcrumbSeparator>
                  </React.Fragment>
                );
              else {
                return (
                  <React.Fragment key={route.path + idx}>
                    <BreadcrumbItem>{route.title}</BreadcrumbItem>
                  </React.Fragment>
                );
              }
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}

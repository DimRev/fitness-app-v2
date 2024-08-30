import { type ReactNode } from "react";
import { cn } from "~/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
};

export function H1({ children, className }: Props) {
  return (
    <h1 className={cn("text-3xl font-extrabold tracking-wide", className)}>
      {children}
    </h1>
  );
}

export function H2({ children, className }: Props) {
  return <h2 className={cn("text-2xl font-bold", className)}>{children}</h2>;
}

export function H3({ children, className }: Props) {
  return <h3 className={cn("text-xl font-bold", className)}>{children}</h3>;
}

export function H4({ children, className }: Props) {
  return <h4 className={cn(className)}>{children}</h4>;
}

export function H5({ children, className }: Props) {
  return <h5 className={cn(className)}>{children}</h5>;
}

export function H6({ children, className }: Props) {
  return <h6 className={cn(className)}>{children}</h6>;
}

export function P({ children, className }: Props) {
  return <p className={cn(className)}>{children}</p>;
}

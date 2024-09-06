import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function arrayDiff(a: string[], b: string[]) {
  const difference = a
    .filter((str) => !b.includes(str))
    .concat(b.filter((str) => !a.includes(str)));
  return difference;
}

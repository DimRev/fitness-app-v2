import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function arrayDiff(a: string[], b: string[]) {
  const difference: string[] = [];
  if (a > b) {
    for (const str of a) {
      if (b.indexOf(str) === -1) {
        difference.push(str);
      }
    }
  } else {
    for (const str of b) {
      if (a.indexOf(str) === -1) {
        difference.push(str);
      }
    }
  }
  return difference;
}

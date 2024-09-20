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

export async function computeCheckSum(file: File) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hushArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hushArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

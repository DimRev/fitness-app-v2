import axios from "axios";
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

interface FormattedError extends Error {
  message: string;
}

export function CatchLogOptThrowError(e: unknown, throwError = false) {
  if (axios.isAxiosError(e) && e.response) {
    const errResponse = e.response.data as { message: string };
    console.error(`${e.response.status} | ${errResponse.message}`);
    if (throwError) {
      throw new Error(errResponse.message) as FormattedError;
    }
  } else if (e instanceof Error) {
    console.error(e.message);
    if (throwError) {
      throw e as FormattedError;
    }
  } else if (typeof e === "string") {
    console.error(e);
    if (throwError) {
      throw new Error(e) as FormattedError;
    }
  } else {
    console.error("An unexpected error occurred");
    if (throwError) {
      throw new Error("An unexpected error occurred") as FormattedError;
    }
  }
}

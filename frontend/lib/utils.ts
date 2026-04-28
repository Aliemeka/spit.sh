import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function resolveTimeZone(timezone: string): string {
  try {
    new Intl.DateTimeFormat("en-GB", { timeZone: timezone });
    return timezone;
  } catch {
    return "UTC";
  }
}

export function getLocalTime(timezone: string): string {
  return new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: resolveTimeZone(timezone),
  });
}

export function getLocalDate(timezone: string): string {
  return new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: resolveTimeZone(timezone),
  });
}

import { Interval } from "@/lib/types/analyticsTypes";

export const INTERVAL_OPTIONS: { value: Interval; label: string }[] = [
  { value: "24h", label: "Last 24 hours" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "all", label: "All time" },
];

export const DEFAULT_INTERVAL: Interval = "24h";

export function getIntervalLabel(interval: Interval): string {
  return INTERVAL_OPTIONS.find((o) => o.value === interval)?.label ?? interval;
}

function parseBackendDate(start: string): Date {
  // Backend returns naive UTC ISO strings (e.g. "2026-05-28T15:00:00").
  // Without a "Z" or offset, JS parses them as local time, which is wrong.
  const hasTz = /Z|[+-]\d{2}:?\d{2}$/.test(start);
  return new Date(hasTz ? start : `${start}Z`);
}

function ordinalSuffix(n: number): string {
  if (n >= 11 && n <= 13) return "th";
  switch (n % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

export function formatBucketStart(start: string, interval: Interval): string {
  const d = parseBackendDate(start);
  if (interval === "24h") {
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: true,
    });
  }
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatTooltipLabel(start: string, interval: Interval): string {
  const d = parseBackendDate(start);
  const month = d.toLocaleString("en-US", { month: "short" });
  const day = d.getDate();
  const datePart = `${month} ${day}${ordinalSuffix(day)}`;
  if (interval === "24h") {
    const hourPart = d
      .toLocaleTimeString("en-US", { hour: "numeric", hour12: true })
      .replace(/\s/g, "")
      .toUpperCase();
    return `${datePart}, ${hourPart}`;
  }
  return datePart;
}

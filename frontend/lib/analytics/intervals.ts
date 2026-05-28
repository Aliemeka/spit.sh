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

export function formatBucketStart(start: string, interval: Interval): string {
  const d = new Date(start);
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

"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  AnalyticsFilters,
  DeviceFilter,
  Interval,
} from "@/lib/types/analyticsTypes";
import { DEFAULT_INTERVAL } from "@/lib/analytics/intervals";

const VALID_INTERVALS: Interval[] = ["24h", "7d", "30d", "90d", "all"];
const VALID_DEVICES: DeviceFilter[] = ["desktop", "mobile", "tablet", "unknown"];

export type FilterKey = keyof AnalyticsFilters;

function readInterval(params: URLSearchParams): Interval {
  const v = params.get("interval");
  if (v && (VALID_INTERVALS as string[]).includes(v)) return v as Interval;
  return DEFAULT_INTERVAL;
}

function readDevice(params: URLSearchParams): DeviceFilter | undefined {
  const v = params.get("device");
  if (v && (VALID_DEVICES as string[]).includes(v)) return v as DeviceFilter;
  return undefined;
}

export function useAnalyticsFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo<AnalyticsFilters>(() => {
    return {
      interval: readInterval(searchParams),
      linkId: searchParams.get("linkId") ?? undefined,
      country: searchParams.get("country") ?? undefined,
      city: searchParams.get("city") ?? undefined,
      device: readDevice(searchParams),
      browser: searchParams.get("browser") ?? undefined,
      os: searchParams.get("os") ?? undefined,
      referer: searchParams.get("referer") ?? undefined,
      utm_source: searchParams.get("utm_source") ?? undefined,
      utm_medium: searchParams.get("utm_medium") ?? undefined,
      utm_campaign: searchParams.get("utm_campaign") ?? undefined,
    };
  }, [searchParams]);

  const writeParams = useCallback(
    (next: URLSearchParams) => {
      const query = next.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router],
  );

  const setFilter = useCallback(
    (key: FilterKey, value: string | undefined) => {
      const next = new URLSearchParams(searchParams.toString());
      if (value === undefined || value === "") {
        next.delete(key);
      } else {
        next.set(key, value);
      }
      writeParams(next);
    },
    [searchParams, writeParams],
  );

  const removeFilter = useCallback(
    (key: FilterKey) => {
      const next = new URLSearchParams(searchParams.toString());
      next.delete(key);
      writeParams(next);
    },
    [searchParams, writeParams],
  );

  const clearAll = useCallback(() => {
    const next = new URLSearchParams();
    const i = searchParams.get("interval");
    if (i) next.set("interval", i);
    writeParams(next);
  }, [searchParams, writeParams]);

  return { filters, setFilter, removeFilter, clearAll };
}

export function getDimensionFilters(filters: AnalyticsFilters): AnalyticsFilters {
  return filters;
}

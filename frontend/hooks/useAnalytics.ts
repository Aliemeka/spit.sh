"use client";

import { useQuery } from "@tanstack/react-query";
import { getAnalyticsAction } from "@/app/actions/analytics";
import {
  AnalyticsCount,
  AnalyticsFilters,
  BrowserBreakdown,
  CityBreakdown,
  CountryBreakdown,
  DeviceBreakdown,
  OsBreakdown,
  RefererBreakdown,
  TimeseriesBucket,
  TopLinkBreakdown,
  UtmCampaignBreakdown,
  UtmMediumBreakdown,
  UtmSourceBreakdown,
} from "@/lib/types/analyticsTypes";

const STALE_TIME = 30_000;

function makeKey(
  projectSlug: string,
  groupBy: string,
  filters?: AnalyticsFilters,
) {
  return ["analytics", projectSlug, groupBy, filters ?? {}] as const;
}

export function useAnalyticsCount(
  projectSlug: string,
  filters?: AnalyticsFilters,
) {
  return useQuery<AnalyticsCount>({
    queryKey: makeKey(projectSlug, "count", filters),
    queryFn: () => getAnalyticsAction(projectSlug, "count", filters),
    staleTime: STALE_TIME,
  });
}

export function useAnalyticsTimeseries(
  projectSlug: string,
  filters?: AnalyticsFilters,
) {
  return useQuery<TimeseriesBucket[]>({
    queryKey: makeKey(projectSlug, "timeseries", filters),
    queryFn: () => getAnalyticsAction(projectSlug, "timeseries", filters),
    staleTime: STALE_TIME,
  });
}

export function useAnalyticsCountries(
  projectSlug: string,
  filters?: AnalyticsFilters,
) {
  return useQuery<CountryBreakdown[]>({
    queryKey: makeKey(projectSlug, "countries", filters),
    queryFn: () => getAnalyticsAction(projectSlug, "countries", filters),
    staleTime: STALE_TIME,
  });
}

export function useAnalyticsCities(
  projectSlug: string,
  filters?: AnalyticsFilters,
) {
  return useQuery<CityBreakdown[]>({
    queryKey: makeKey(projectSlug, "cities", filters),
    queryFn: () => getAnalyticsAction(projectSlug, "cities", filters),
    staleTime: STALE_TIME,
  });
}

export function useAnalyticsDevices(
  projectSlug: string,
  filters?: AnalyticsFilters,
) {
  return useQuery<DeviceBreakdown[]>({
    queryKey: makeKey(projectSlug, "devices", filters),
    queryFn: () => getAnalyticsAction(projectSlug, "devices", filters),
    staleTime: STALE_TIME,
  });
}

export function useAnalyticsBrowsers(
  projectSlug: string,
  filters?: AnalyticsFilters,
) {
  return useQuery<BrowserBreakdown[]>({
    queryKey: makeKey(projectSlug, "browsers", filters),
    queryFn: () => getAnalyticsAction(projectSlug, "browsers", filters),
    staleTime: STALE_TIME,
  });
}

export function useAnalyticsOSes(
  projectSlug: string,
  filters?: AnalyticsFilters,
) {
  return useQuery<OsBreakdown[]>({
    queryKey: makeKey(projectSlug, "os", filters),
    queryFn: () => getAnalyticsAction(projectSlug, "os", filters),
    staleTime: STALE_TIME,
  });
}

export function useAnalyticsReferers(
  projectSlug: string,
  filters?: AnalyticsFilters,
) {
  return useQuery<RefererBreakdown[]>({
    queryKey: makeKey(projectSlug, "referers", filters),
    queryFn: () => getAnalyticsAction(projectSlug, "referers", filters),
    staleTime: STALE_TIME,
  });
}

export function useAnalyticsUtmSources(
  projectSlug: string,
  filters?: AnalyticsFilters,
) {
  return useQuery<UtmSourceBreakdown[]>({
    queryKey: makeKey(projectSlug, "utm_sources", filters),
    queryFn: () => getAnalyticsAction(projectSlug, "utm_sources", filters),
    staleTime: STALE_TIME,
  });
}

export function useAnalyticsUtmMediums(
  projectSlug: string,
  filters?: AnalyticsFilters,
) {
  return useQuery<UtmMediumBreakdown[]>({
    queryKey: makeKey(projectSlug, "utm_mediums", filters),
    queryFn: () => getAnalyticsAction(projectSlug, "utm_mediums", filters),
    staleTime: STALE_TIME,
  });
}

export function useAnalyticsUtmCampaigns(
  projectSlug: string,
  filters?: AnalyticsFilters,
) {
  return useQuery<UtmCampaignBreakdown[]>({
    queryKey: makeKey(projectSlug, "utm_campaigns", filters),
    queryFn: () => getAnalyticsAction(projectSlug, "utm_campaigns", filters),
    staleTime: STALE_TIME,
  });
}

export function useAnalyticsTopLinks(
  projectSlug: string,
  filters?: AnalyticsFilters,
) {
  return useQuery<TopLinkBreakdown[]>({
    queryKey: makeKey(projectSlug, "top_links", filters),
    queryFn: () => getAnalyticsAction(projectSlug, "top_links", filters),
    staleTime: STALE_TIME,
  });
}

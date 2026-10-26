"use client";

import { useQuery } from "@tanstack/react-query";
import { getAnalyticsAction } from "@/app/actions/analytics";
import { useWorkspace } from "@/providers/WorkspaceProvider";
import { AnalyticsFilters, GroupBy } from "@/lib/types/analyticsTypes";

const STALE_TIME = 30_000;

function useAnalyticsQuery<G extends GroupBy>(
  groupBy: G,
  filters?: AnalyticsFilters,
) {
  const { slug } = useWorkspace();
  return useQuery({
    queryKey: ["analytics", slug, groupBy, filters ?? {}],
    queryFn: () => getAnalyticsAction(slug, groupBy, filters),
    staleTime: STALE_TIME,
  });
}

export const useAnalyticsCount = (filters?: AnalyticsFilters) =>
  useAnalyticsQuery("count", filters);

export const useAnalyticsTimeseries = (filters?: AnalyticsFilters) =>
  useAnalyticsQuery("timeseries", filters);

export const useAnalyticsCountries = (filters?: AnalyticsFilters) =>
  useAnalyticsQuery("countries", filters);

export const useAnalyticsCities = (filters?: AnalyticsFilters) =>
  useAnalyticsQuery("cities", filters);

export const useAnalyticsDevices = (filters?: AnalyticsFilters) =>
  useAnalyticsQuery("devices", filters);

export const useAnalyticsBrowsers = (filters?: AnalyticsFilters) =>
  useAnalyticsQuery("browsers", filters);

export const useAnalyticsOSes = (filters?: AnalyticsFilters) =>
  useAnalyticsQuery("os", filters);

export const useAnalyticsReferers = (filters?: AnalyticsFilters) =>
  useAnalyticsQuery("referers", filters);

export const useAnalyticsUtmSources = (filters?: AnalyticsFilters) =>
  useAnalyticsQuery("utm_sources", filters);

export const useAnalyticsUtmMediums = (filters?: AnalyticsFilters) =>
  useAnalyticsQuery("utm_mediums", filters);

export const useAnalyticsUtmCampaigns = (filters?: AnalyticsFilters) =>
  useAnalyticsQuery("utm_campaigns", filters);

export const useAnalyticsTopLinks = (filters?: AnalyticsFilters) =>
  useAnalyticsQuery("top_links", filters);

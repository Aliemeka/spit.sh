"use server";

import axios from "axios";
import { API_URL } from "@/lib/config/public_env";
import { getSessionToken } from "./auth";
import {
  AnalyticsCount,
  AnalyticsFilters,
  BrowserBreakdown,
  CityBreakdown,
  CountryBreakdown,
  DeviceBreakdown,
  GroupBy,
  OsBreakdown,
  RefererBreakdown,
  TimeseriesBucket,
  TopLinkBreakdown,
  UtmCampaignBreakdown,
  UtmMediumBreakdown,
  UtmSourceBreakdown,
} from "@/lib/types/analyticsTypes";

async function getToken() {
  const token = await getSessionToken();
  if (!token) throw new Error("Unauthorized");
  return token;
}

type GroupByReturnMap = {
  count: AnalyticsCount;
  timeseries: TimeseriesBucket[];
  countries: CountryBreakdown[];
  cities: CityBreakdown[];
  devices: DeviceBreakdown[];
  browsers: BrowserBreakdown[];
  os: OsBreakdown[];
  referers: RefererBreakdown[];
  utm_sources: UtmSourceBreakdown[];
  utm_mediums: UtmMediumBreakdown[];
  utm_campaigns: UtmCampaignBreakdown[];
  top_links: TopLinkBreakdown[];
};

export async function getAnalyticsAction<G extends GroupBy>(
  projectSlug: string,
  groupBy: G,
  filters?: AnalyticsFilters,
): Promise<GroupByReturnMap[G]> {
  const token = await getToken();
  const res = await axios.get(`${API_URL}/analytics/${projectSlug}`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { groupBy, ...filters },
  });
  return res.data;
}

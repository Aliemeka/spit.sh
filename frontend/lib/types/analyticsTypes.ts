export type Interval = "24h" | "7d" | "30d" | "90d" | "all";

export type GroupBy =
  | "count"
  | "timeseries"
  | "countries"
  | "cities"
  | "devices"
  | "browsers"
  | "os"
  | "referers"
  | "utm_sources"
  | "utm_mediums"
  | "utm_campaigns"
  | "top_links";

export type DeviceFilter = "desktop" | "mobile" | "tablet" | "unknown";

export interface AnalyticsFilters {
  interval?: Interval;
  linkId?: string;
  country?: string;
  city?: string;
  device?: DeviceFilter;
  browser?: string;
  os?: string;
  referer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

export interface AnalyticsCount {
  clicks: number;
}

export interface TimeseriesBucket {
  start: string;
  clicks: number;
}

export interface CountryBreakdown {
  country: string;
  country_code: string;
  clicks: number;
}

export interface CityBreakdown {
  city: string;
  country_code: string;
  clicks: number;
}

export interface DeviceBreakdown {
  device: string;
  clicks: number;
}

export interface BrowserBreakdown {
  browser: string;
  clicks: number;
}

export interface OsBreakdown {
  os: string;
  clicks: number;
}

export interface RefererBreakdown {
  referer: string;
  clicks: number;
}

export interface UtmSourceBreakdown {
  utm_source: string;
  clicks: number;
}

export interface UtmMediumBreakdown {
  utm_medium: string;
  clicks: number;
}

export interface UtmCampaignBreakdown {
  utm_campaign: string;
  clicks: number;
}

export interface TopLinkBreakdown {
  id: string;
  slug: string;
  url: string;
  shortenUrl: string;
  clicks: number;
}

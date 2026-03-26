export interface LinkPayload {
  url: string;
  slug?: string;
  tags?: string[];
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

export interface LinkResponse {
  id: string;
  url: string;
  slug: string;
  shortenUrl: string;
  tags: string[];
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  click_count: number;
  created_at: string;
}

export interface LinkQueryParams {
  tag: string;
  limit: number;
  offset: number;
}

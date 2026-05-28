"use client";

import { FC, useMemo } from "react";
import RichListWidget, { RichListRow } from "./RichListWidget";
import { useAnalyticsTopLinks } from "@/hooks/useAnalytics";
import { useAnalyticsFilters } from "@/hooks/useAnalyticsFilters";

interface Props {
  projectSlug: string;
}

function faviconFor(url: string): string | null {
  try {
    const hostname = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
  } catch {
    return null;
  }
}

const TopLinksWidget: FC<Props> = ({ projectSlug }) => {
  const { filters, setFilter } = useAnalyticsFilters();
  const { data = [], isLoading } = useAnalyticsTopLinks(projectSlug, filters);

  const rows = useMemo<RichListRow[]>(
    () =>
      data.map((link) => {
        const favicon = faviconFor(link.url);
        return {
          key: link.id,
          value: link.clicks,
          onClick: () => setFilter("linkId", link.id),
          label: (
            <span className='flex items-center gap-2 min-w-0'>
              {favicon && (
                <img
                  src={favicon}
                  alt=''
                  width={16}
                  height={16}
                  className='rounded shrink-0'
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
              <span className='truncate'>{link.shortenUrl}</span>
            </span>
          ),
        };
      }),
    [data, setFilter],
  );

  return (
    <RichListWidget
      title='Short Links'
      rows={rows}
      isLoading={isLoading}
      emptyText='No link clicks in this period'
    />
  );
};

export default TopLinksWidget;

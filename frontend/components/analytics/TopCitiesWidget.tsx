"use client";

import React, { FC, useMemo } from "react";
import RichListWidget, { RichListRow } from "./RichListWidget";
import { useAnalyticsCities } from "@/hooks/useAnalytics";
import { useAnalyticsFilters } from "@/hooks/useAnalyticsFilters";
import { countryCodeToFlag } from "@/lib/analytics/flags";

interface Props {
  projectSlug: string;
}

const TopCitiesWidget: FC<Props> = ({ projectSlug }) => {
  const { filters } = useAnalyticsFilters();
  const { data = [], isLoading } = useAnalyticsCities(projectSlug, filters);

  const rows = useMemo<RichListRow[]>(
    () =>
      data.map((c) => ({
        key: `${c.city}-${c.country_code}`,
        value: c.clicks,
        label: (
          <span className='flex items-center gap-2 min-w-0'>
            <span className='shrink-0'>{countryCodeToFlag(c.country_code)}</span>
            <span className='truncate'>{c.city}</span>
          </span>
        ),
      })),
    [data],
  );

  return <RichListWidget title='Cities' rows={rows} isLoading={isLoading} />;
};

export default TopCitiesWidget;

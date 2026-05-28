"use client";

import React, { FC, useMemo } from "react";
import RichListWidget, { RichListRow } from "./RichListWidget";
import { useAnalyticsCountries } from "@/hooks/useAnalytics";
import { useAnalyticsFilters } from "@/hooks/useAnalyticsFilters";
import { countryCodeToFlag } from "@/lib/analytics/flags";

interface Props {
  projectSlug: string;
}

const TopCountriesWidget: FC<Props> = ({ projectSlug }) => {
  const { filters } = useAnalyticsFilters();
  const { data = [], isLoading } = useAnalyticsCountries(projectSlug, filters);
  const { setFilter } = useAnalyticsFilters();

  const rows = useMemo<RichListRow[]>(
    () =>
      data.map((c) => ({
        key: c.country_code,
        value: c.clicks,
        onClick: () => setFilter("country", c.country_code),
        label: (
          <span className='flex items-center gap-2 min-w-0'>
            <span className='shrink-0'>{countryCodeToFlag(c.country_code)}</span>
            <span className='truncate'>{c.country}</span>
          </span>
        ),
      })),
    [data, setFilter],
  );

  return (
    <RichListWidget title='Countries' rows={rows} isLoading={isLoading} />
  );
};

export default TopCountriesWidget;

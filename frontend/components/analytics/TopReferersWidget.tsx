"use client";

import React, { FC, useMemo } from "react";
import RichListWidget, { RichListRow } from "./RichListWidget";
import { useAnalyticsReferers } from "@/hooks/useAnalytics";
import { useAnalyticsFilters } from "@/hooks/useAnalyticsFilters";

interface Props {
  projectSlug: string;
}

const TopReferersWidget: FC<Props> = ({ projectSlug }) => {
  const { filters } = useAnalyticsFilters();
  const { data = [], isLoading } = useAnalyticsReferers(projectSlug, filters);

  const rows = useMemo<RichListRow[]>(
    () =>
      data.map((r) => ({
        key: r.referer,
        value: r.clicks,
        label: <span className='truncate block'>{r.referer}</span>,
      })),
    [data],
  );

  return (
    <RichListWidget title='Referrers' rows={rows} isLoading={isLoading} />
  );
};

export default TopReferersWidget;

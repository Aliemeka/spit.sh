"use client";

import React, { FC } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import WidgetCard from "./WidgetCard";
import WidgetSkeleton from "./WidgetSkeleton";
import { RichListRow } from "./RichListWidget";
import {
  useAnalyticsUtmCampaigns,
  useAnalyticsUtmMediums,
  useAnalyticsUtmSources,
} from "@/hooks/useAnalytics";
import { useAnalyticsFilters } from "@/hooks/useAnalyticsFilters";

interface Props {
  projectSlug: string;
}

const UtmTabbedWidget: FC<Props> = ({ projectSlug }) => {
  const { filters, setFilter } = useAnalyticsFilters();
  const sources = useAnalyticsUtmSources(projectSlug, filters);
  const mediums = useAnalyticsUtmMediums(projectSlug, filters);
  const campaigns = useAnalyticsUtmCampaigns(projectSlug, filters);

  return (
    <WidgetCard className='min-h-[300px]'>
      <Tabs defaultValue='source'>
        <TabsList className='bg-zinc-100 dark:bg-zinc-800/60'>
          <TabsTrigger value='source'>Source</TabsTrigger>
          <TabsTrigger value='medium'>Medium</TabsTrigger>
          <TabsTrigger value='campaign'>Campaign</TabsTrigger>
        </TabsList>
        <TabsContent value='source'>
          <UtmPanel
            isLoading={sources.isLoading}
            rows={(sources.data ?? []).map((s) => ({
              key: s.utm_source,
              value: s.clicks,
              onClick: () => setFilter("utm_source", s.utm_source),
              label: <span className='truncate block'>{s.utm_source}</span>,
            }))}
          />
        </TabsContent>
        <TabsContent value='medium'>
          <UtmPanel
            isLoading={mediums.isLoading}
            rows={(mediums.data ?? []).map((m) => ({
              key: m.utm_medium,
              value: m.clicks,
              onClick: () => setFilter("utm_medium", m.utm_medium),
              label: <span className='truncate block'>{m.utm_medium}</span>,
            }))}
          />
        </TabsContent>
        <TabsContent value='campaign'>
          <UtmPanel
            isLoading={campaigns.isLoading}
            rows={(campaigns.data ?? []).map((c) => ({
              key: c.utm_campaign,
              value: c.clicks,
              onClick: () => setFilter("utm_campaign", c.utm_campaign),
              label: <span className='truncate block'>{c.utm_campaign}</span>,
            }))}
          />
        </TabsContent>
      </Tabs>
    </WidgetCard>
  );
};

export default UtmTabbedWidget;

const UtmPanel: FC<{ rows: RichListRow[]; isLoading: boolean }> = ({
  rows,
  isLoading,
}) => {
  if (isLoading) return <WidgetSkeleton rows={5} />;
  if (!rows.length) {
    return (
      <p className='text-sm text-zinc-500 dark:text-zinc-400 text-center py-8'>
        No UTM data yet — add UTM parameters when creating links.
      </p>
    );
  }
  const max = rows.reduce((m, r) => Math.max(m, r.value), 0) || 1;
  return (
    <ul className='space-y-1.5'>
      {rows.slice(0, 8).map((row) => {
        const pct = (row.value / max) * 100;
        return (
          <li key={row.key} className='relative'>
            <button
              type='button'
              onClick={row.onClick}
              className='relative w-full text-left rounded-md hover:ring-1 hover:ring-fuchsia-300 dark:hover:ring-fuchsia-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500'
            >
              <div
                className='absolute inset-0 bg-fuchsia-100 dark:bg-fuchsia-950/40 rounded-md'
                style={{ width: `${pct}%` }}
                aria-hidden
              />
              <div className='relative flex items-center justify-between gap-3 px-2.5 py-1.5'>
                <span className='text-sm text-zinc-800 dark:text-zinc-100 truncate min-w-0'>
                  {row.label}
                </span>
                <span className='text-sm font-medium text-zinc-700 dark:text-zinc-300 tabular-nums shrink-0'>
                  {row.value.toLocaleString()}
                </span>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
};

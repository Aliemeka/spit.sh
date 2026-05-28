"use client";

import React, { FC } from "react";
import {
  EvilAreaChart,
  Area,
  XAxis,
  YAxis,
  Grid,
  Tooltip,
} from "@/components/evilcharts/charts/area-chart";
import WidgetCard from "./WidgetCard";
import WidgetSkeleton from "./WidgetSkeleton";
import {
  useAnalyticsCount,
  useAnalyticsTimeseries,
} from "@/hooks/useAnalytics";
import { useAnalyticsFilters } from "@/hooks/useAnalyticsFilters";
import { clicksAreaConfig } from "@/lib/analytics/chartConfigs";
import { formatBucketStart } from "@/lib/analytics/intervals";

interface Props {
  projectSlug: string;
}

const ClicksHeroChart: FC<Props> = ({ projectSlug }) => {
  const { filters } = useAnalyticsFilters();
  const interval = filters.interval ?? "24h";
  const {
    data: countData,
    isLoading: countLoading,
  } = useAnalyticsCount(projectSlug, filters);
  const {
    data: series = [],
    isLoading: seriesLoading,
  } = useAnalyticsTimeseries(projectSlug, filters);

  return (
    <WidgetCard className='mb-5'>
      <div className='mb-4'>
        <p className='text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400'>
          Clicks
        </p>
        {countLoading ? (
          <div className='mt-1.5 h-9 w-24 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded' />
        ) : (
          <p className='text-3xl font-semibold text-zinc-900 dark:text-zinc-50 tabular-nums'>
            {(countData?.clicks ?? 0).toLocaleString()}
          </p>
        )}
      </div>

      <div className='h-[260px]'>
        {seriesLoading ? (
          <WidgetSkeleton rows={6} />
        ) : (
          <EvilAreaChart
            data={series as unknown as Record<string, unknown>[]}
            config={clicksAreaConfig}
            xDataKey='start'
            curveType='linear'
            className='h-full w-full'
          >
            <Grid strokeOpacity={0.25} />
            <XAxis
              dataKey='start'
              tickFormatter={(v: string) => formatBucketStart(v, interval)}
            />
            <YAxis dataKey='clicks' />
            <Tooltip />
            <Area
              dataKey='clicks'
              variant='gradient'
              strokeVariant='solid'
            />
          </EvilAreaChart>
        )}
      </div>
    </WidgetCard>
  );
};

export default ClicksHeroChart;

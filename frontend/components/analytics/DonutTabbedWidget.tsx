"use client";

import React, { FC, useMemo } from "react";
import {
  EvilPieChart,
  Pie,
  Tooltip,
  Legend,
} from "@/components/evilcharts/charts/pie-chart";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import WidgetCard from "./WidgetCard";
import WidgetSkeleton from "./WidgetSkeleton";
import {
  useAnalyticsBrowsers,
  useAnalyticsDevices,
  useAnalyticsOSes,
} from "@/hooks/useAnalytics";
import { useAnalyticsFilters } from "@/hooks/useAnalyticsFilters";
import { buildDonutConfig } from "@/lib/analytics/chartConfigs";

interface Props {
  projectSlug: string;
}

const DonutTabbedWidget: FC<Props> = ({ projectSlug }) => {
  const { filters } = useAnalyticsFilters();
  const devices = useAnalyticsDevices(projectSlug, filters);
  const browsers = useAnalyticsBrowsers(projectSlug, filters);
  const oses = useAnalyticsOSes(projectSlug, filters);

  return (
    <WidgetCard>
      <Tabs defaultValue='devices'>
        <TabsList className='bg-zinc-100 dark:bg-zinc-800/60'>
          <TabsTrigger value='devices'>Devices</TabsTrigger>
          <TabsTrigger value='browsers'>Browsers</TabsTrigger>
          <TabsTrigger value='os'>OS</TabsTrigger>
        </TabsList>
        <TabsContent value='devices'>
          <DonutPanel
            isLoading={devices.isLoading}
            rows={(devices.data ?? []).map((d) => ({
              key: d.device,
              label: d.device,
              value: d.clicks,
            }))}
          />
        </TabsContent>
        <TabsContent value='browsers'>
          <DonutPanel
            isLoading={browsers.isLoading}
            rows={(browsers.data ?? []).map((b) => ({
              key: b.browser,
              label: b.browser,
              value: b.clicks,
            }))}
          />
        </TabsContent>
        <TabsContent value='os'>
          <DonutPanel
            isLoading={oses.isLoading}
            rows={(oses.data ?? []).map((o) => ({
              key: o.os,
              label: o.os,
              value: o.clicks,
            }))}
          />
        </TabsContent>
      </Tabs>
    </WidgetCard>
  );
};

export default DonutTabbedWidget;

interface DonutRow {
  key: string;
  label: string;
  value: number;
}

const DonutPanel: FC<{ rows: DonutRow[]; isLoading: boolean }> = ({
  rows,
  isLoading,
}) => {
  const config = useMemo(
    () => buildDonutConfig(rows.map((r) => ({ key: r.key, label: r.label }))),
    [rows],
  );

  if (isLoading) {
    return (
      <div className='h-[260px] grid place-items-center'>
        <WidgetSkeleton rows={4} />
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className='h-[260px] grid place-items-center'>
        <p className='text-sm text-zinc-500 dark:text-zinc-400'>
          No data yet for this period
        </p>
      </div>
    );
  }

  return (
    <div className='h-[300px]'>
      <EvilPieChart
        data={rows as unknown as Record<string, unknown>[]}
        config={config}
        dataKey='value'
        nameKey='key'
        className='h-full w-full'
      >
        <Pie
          innerRadius={60}
          outerRadius='80%'
          cornerRadius={6}
          paddingAngle={3}
        />
        <Tooltip />
        <Legend />
      </EvilPieChart>
    </div>
  );
};

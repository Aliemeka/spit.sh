"use client";

import { FC } from "react";
import FilterPopover from "./FilterPopover";
import IntervalSelect from "./IntervalSelect";
import DomainProLock from "./DomainProLock";
import ActiveFilterChips from "./ActiveFilterChips";
import { useAnalyticsFilters } from "@/hooks/useAnalyticsFilters";

interface Props {
  projectSlug: string;
}

const FilterBar: FC<Props> = ({ projectSlug }) => {
  const { filters, setFilter } = useAnalyticsFilters();
  return (
    <div className='sticky top-0 z-20 -mx-4 px-4 py-3 mb-5 bg-zinc-50/90 dark:bg-zinc-950/90 backdrop-blur border-b border-zinc-200 dark:border-zinc-800'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex items-center gap-2'>
          <FilterPopover projectSlug={projectSlug} />
          <IntervalSelect
            value={filters.interval ?? "24h"}
            onChange={(v) => setFilter("interval", v)}
          />
        </div>
        <DomainProLock />
      </div>
      <ActiveFilterChips projectSlug={projectSlug} />
    </div>
  );
};

export default FilterBar;

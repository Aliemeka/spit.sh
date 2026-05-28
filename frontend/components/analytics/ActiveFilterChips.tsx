"use client";

import React, { FC, useMemo } from "react";
import { XIcon } from "@phosphor-icons/react";
import {
  FilterKey,
  useAnalyticsFilters,
} from "@/hooks/useAnalyticsFilters";
import { useProjectLinks } from "@/hooks/useProjectLinks";
import { countryCodeToFlag } from "@/lib/analytics/flags";

interface Props {
  projectSlug: string;
}

interface Chip {
  key: FilterKey;
  label: string;
  value: React.ReactNode;
}

const ActiveFilterChips: FC<Props> = ({ projectSlug }) => {
  const { filters, removeFilter, clearAll } = useAnalyticsFilters();
  const { links } = useProjectLinks(projectSlug);

  const chips = useMemo<Chip[]>(() => {
    const out: Chip[] = [];
    if (filters.linkId) {
      const link = links.find((l) => l.id === filters.linkId);
      out.push({
        key: "linkId",
        label: "Link",
        value: link ? `/${link.slug}` : filters.linkId.slice(0, 8),
      });
    }
    if (filters.country) {
      out.push({
        key: "country",
        label: "Country",
        value: (
          <>
            <span className='mr-1'>{countryCodeToFlag(filters.country)}</span>
            {filters.country}
          </>
        ),
      });
    }
    if (filters.city) {
      out.push({ key: "city", label: "City", value: filters.city });
    }
    if (filters.device) {
      out.push({ key: "device", label: "Device", value: filters.device });
    }
    if (filters.browser) {
      out.push({ key: "browser", label: "Browser", value: filters.browser });
    }
    if (filters.os) {
      out.push({ key: "os", label: "OS", value: filters.os });
    }
    if (filters.referer) {
      out.push({
        key: "referer",
        label: "Referrer",
        value: filters.referer,
      });
    }
    if (filters.utm_source) {
      out.push({
        key: "utm_source",
        label: "UTM source",
        value: filters.utm_source,
      });
    }
    if (filters.utm_medium) {
      out.push({
        key: "utm_medium",
        label: "UTM medium",
        value: filters.utm_medium,
      });
    }
    if (filters.utm_campaign) {
      out.push({
        key: "utm_campaign",
        label: "UTM campaign",
        value: filters.utm_campaign,
      });
    }
    return out;
  }, [filters, links]);

  if (!chips.length) return null;

  return (
    <div className='flex flex-wrap items-center gap-2 mt-3'>
      {chips.map((chip) => (
        <span
          key={chip.key}
          className='inline-flex items-center gap-1.5 pl-2.5 pr-1 py-1 text-xs rounded-full bg-fuchsia-50 dark:bg-fuchsia-950/40 text-fuchsia-700 dark:text-fuchsia-300 border border-fuchsia-200 dark:border-fuchsia-900'
        >
          <span className='text-fuchsia-500/80 dark:text-fuchsia-400/80'>
            {chip.label}:
          </span>
          <span className='font-medium'>{chip.value}</span>
          <button
            type='button'
            onClick={() => removeFilter(chip.key)}
            className='ml-0.5 p-0.5 rounded-full hover:bg-fuchsia-100 dark:hover:bg-fuchsia-900/60'
            aria-label={`Remove ${chip.label} filter`}
          >
            <XIcon size={11} weight='bold' />
          </button>
        </span>
      ))}
      {chips.length > 1 && (
        <button
          type='button'
          onClick={clearAll}
          className='text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 underline underline-offset-2'
        >
          Clear all
        </button>
      )}
    </div>
  );
};

export default ActiveFilterChips;

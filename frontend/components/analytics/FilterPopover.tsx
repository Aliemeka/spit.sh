"use client";

import React, { FC, useState } from "react";
import {
  CaretDownIcon,
  CaretLeftIcon,
  FunnelIcon,
  GlobeIcon,
  LinkIcon,
  DeviceMobileIcon,
} from "@phosphor-icons/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useProjectLinks } from "@/hooks/useProjectLinks";
import { useAnalyticsCountries } from "@/hooks/useAnalytics";
import { useAnalyticsFilters } from "@/hooks/useAnalyticsFilters";
import { countryCodeToFlag } from "@/lib/analytics/flags";
import { DeviceFilter } from "@/lib/types/analyticsTypes";

interface Props {
  projectSlug: string;
}

type Dimension = "link" | "country" | "device";

const DIMENSIONS: { value: Dimension; label: string; icon: React.ReactNode }[] =
  [
    { value: "link", label: "Link", icon: <LinkIcon size={14} /> },
    { value: "country", label: "Country", icon: <GlobeIcon size={14} /> },
    { value: "device", label: "Device", icon: <DeviceMobileIcon size={14} /> },
  ];

const DEVICE_OPTIONS: { value: DeviceFilter; label: string }[] = [
  { value: "desktop", label: "Desktop" },
  { value: "mobile", label: "Mobile" },
  { value: "tablet", label: "Tablet" },
  { value: "unknown", label: "Unknown" },
];

const FilterPopover: FC<Props> = ({ projectSlug }) => {
  const [open, setOpen] = useState(false);
  const [dim, setDim] = useState<Dimension | null>(null);
  const { filters, setFilter } = useAnalyticsFilters();

  const handleClose = () => {
    setOpen(false);
    setDim(null);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) setDim(null);
      }}
    >
      <PopoverTrigger asChild>
        <button
          type='button'
          className='inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition'
        >
          <FunnelIcon size={14} />
          Filter
          <CaretDownIcon size={12} className='text-zinc-400' />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align='start'
        className='p-0 w-64 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
      >
        {dim === null ? (
          <div className='py-1.5'>
            <p className='px-3 py-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide'>
              Filter by
            </p>
            {DIMENSIONS.map((d) => (
              <button
                key={d.value}
                type='button'
                onClick={() => setDim(d.value)}
                className='w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
              >
                <span className='text-zinc-500 dark:text-zinc-400'>
                  {d.icon}
                </span>
                {d.label}
              </button>
            ))}
          </div>
        ) : (
          <div>
            <button
              type='button'
              onClick={() => setDim(null)}
              className='w-full flex items-center gap-1.5 px-3 py-2 text-xs text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800'
            >
              <CaretLeftIcon size={12} />
              Back
            </button>
            {dim === "link" && (
              <LinkPicker
                projectSlug={projectSlug}
                currentLinkId={filters.linkId}
                onSelect={(linkId) => {
                  setFilter("linkId", linkId);
                  handleClose();
                }}
              />
            )}
            {dim === "country" && (
              <CountryPicker
                projectSlug={projectSlug}
                currentCountry={filters.country}
                onSelect={(code) => {
                  setFilter("country", code);
                  handleClose();
                }}
              />
            )}
            {dim === "device" && (
              <DevicePicker
                currentDevice={filters.device}
                onSelect={(device) => {
                  setFilter("device", device);
                  handleClose();
                }}
              />
            )}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default FilterPopover;

const LinkPicker: FC<{
  projectSlug: string;
  currentLinkId?: string;
  onSelect: (linkId: string) => void;
}> = ({ projectSlug, currentLinkId, onSelect }) => {
  const { links, loading } = useProjectLinks(projectSlug);
  return (
    <Command className='bg-transparent'>
      <CommandInput placeholder='Search links…' className='h-9' />
      <CommandList>
        <CommandEmpty>{loading ? "Loading…" : "No links found"}</CommandEmpty>
        <CommandGroup>
          {links.map((link) => (
            <CommandItem
              key={link.id}
              value={`${link.slug} ${link.url}`}
              onSelect={() => onSelect(link.id)}
              className={
                link.id === currentLinkId
                  ? "bg-fuchsia-50 dark:bg-fuchsia-950/40"
                  : ""
              }
            >
              <span className='font-medium text-zinc-800 dark:text-zinc-100 truncate'>
                {link.shortenUrl}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

const CountryPicker: FC<{
  projectSlug: string;
  currentCountry?: string;
  onSelect: (code: string) => void;
}> = ({ projectSlug, currentCountry, onSelect }) => {
  const { data: countries = [], isLoading } = useAnalyticsCountries(
    projectSlug,
    { interval: "all" },
  );
  return (
    <Command className='bg-transparent'>
      <CommandInput placeholder='Search countries…' className='h-9' />
      <CommandList>
        <CommandEmpty>
          {isLoading ? "Loading…" : "No country data yet"}
        </CommandEmpty>
        <CommandGroup>
          {countries.map((c) => (
            <CommandItem
              key={c.country_code}
              value={`${c.country} ${c.country_code}`}
              onSelect={() => onSelect(c.country_code)}
              className={
                c.country_code === currentCountry
                  ? "bg-fuchsia-50 dark:bg-fuchsia-950/40"
                  : ""
              }
            >
              <span className='mr-2'>{countryCodeToFlag(c.country_code)}</span>
              <span className='truncate'>{c.country}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

const DevicePicker: FC<{
  currentDevice?: DeviceFilter;
  onSelect: (device: DeviceFilter) => void;
}> = ({ currentDevice, onSelect }) => {
  return (
    <Command className='bg-transparent'>
      <CommandList>
        <CommandGroup>
          {DEVICE_OPTIONS.map((d) => (
            <CommandItem
              key={d.value}
              value={d.value}
              onSelect={() => onSelect(d.value)}
              className={
                d.value === currentDevice
                  ? "bg-fuchsia-50 dark:bg-fuchsia-950/40"
                  : ""
              }
            >
              {d.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

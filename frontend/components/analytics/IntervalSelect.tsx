"use client";

import React, { FC } from "react";
import { CalendarBlankIcon, CaretDownIcon } from "@phosphor-icons/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Interval } from "@/lib/types/analyticsTypes";
import {
  INTERVAL_OPTIONS,
  getIntervalLabel,
} from "@/lib/analytics/intervals";

interface Props {
  value: Interval;
  onChange: (interval: Interval) => void;
}

const IntervalSelect: FC<Props> = ({ value, onChange }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type='button'
          className='inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition'
        >
          <CalendarBlankIcon size={14} />
          {getIntervalLabel(value)}
          <CaretDownIcon size={12} className='text-zinc-400' />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
      >
        {INTERVAL_OPTIONS.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={
              opt.value === value
                ? "bg-fuchsia-50 dark:bg-fuchsia-950/40 text-fuchsia-700 dark:text-fuchsia-300"
                : ""
            }
          >
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default IntervalSelect;

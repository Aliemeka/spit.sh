"use client";

import React, { FC, ReactNode } from "react";
import WidgetCard from "./WidgetCard";
import WidgetSkeleton from "./WidgetSkeleton";

export interface RichListRow {
  key: string;
  label: ReactNode;
  value: number;
  onClick?: () => void;
}

interface Props {
  title: ReactNode;
  action?: ReactNode;
  rows: RichListRow[];
  isLoading?: boolean;
  emptyText?: string;
  maxRows?: number;
}

const RichListWidget: FC<Props> = ({
  title,
  action,
  rows,
  isLoading,
  emptyText = "No data yet for this period",
  maxRows = 8,
}) => {
  if (isLoading) {
    return (
      <WidgetCard title={title} action={action} className='min-h-56'>
        <WidgetSkeleton rows={maxRows} />
      </WidgetCard>
    );
  }

  if (!rows.length) {
    return (
      <WidgetCard title={title} action={action} className='min-h-56'>
        <p className='text-sm text-zinc-500 dark:text-zinc-400 text-center py-8'>
          {emptyText}
        </p>
      </WidgetCard>
    );
  }

  const max = rows.reduce((m, r) => Math.max(m, r.value), 0) || 1;
  const visible = rows.slice(0, maxRows);

  return (
    <WidgetCard title={title} action={action} className='min-h-56'>
      <ul className='space-y-1.5'>
        {visible.map((row) => {
          const pct = (row.value / max) * 100;
          const rowContent = (
            <>
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
            </>
          );
          return (
            <li key={row.key} className='relative'>
              {row.onClick ? (
                <button
                  type='button'
                  onClick={row.onClick}
                  className='relative w-full text-left rounded-md hover:ring-1 hover:ring-fuchsia-300 dark:hover:ring-fuchsia-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500'
                >
                  {rowContent}
                </button>
              ) : (
                <div className='relative w-full'>{rowContent}</div>
              )}
            </li>
          );
        })}
      </ul>
    </WidgetCard>
  );
};

export default RichListWidget;

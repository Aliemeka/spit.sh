import { FC } from "react";
import { cn } from "@/lib/utils";
import { UsageMetric } from "@/lib/types/billingTypes";

const UsageMeter: FC<{ label: string; metric: UsageMetric }> = ({
  label,
  metric,
}) => {
  const percent =
    metric.limit > 0 ? Math.min(100, (metric.used / metric.limit) * 100) : 0;

  return (
    <div className='space-y-2'>
      <div className='flex items-baseline justify-between gap-2'>
        <p className='text-sm font-medium text-zinc-700 dark:text-zinc-300'>
          {label}
        </p>
        <p className='text-sm tabular-nums text-zinc-500 dark:text-zinc-400'>
          <span className='font-medium text-zinc-900 dark:text-zinc-100'>
            {metric.used.toLocaleString()}
          </span>{" "}
          / {metric.limit.toLocaleString()}
        </p>
      </div>
      <div
        role='progressbar'
        aria-label={label}
        aria-valuenow={metric.used}
        aria-valuemax={metric.limit}
        className='h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800'
      >
        <div
          className={cn(
            "h-full rounded-full transition-all",
            percent >= 100
              ? "bg-red-500"
              : percent >= 80
                ? "bg-amber-500"
                : "bg-fuchsia-600",
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default UsageMeter;

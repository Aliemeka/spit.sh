import { FC, ReactNode } from "react";
import { cn } from "@/lib/utils";

const UsageStat: FC<{
  icon: ReactNode;
  label: string;
  used: number;
  limit: number;
  showBar?: boolean;
  className?: string;
}> = ({ icon, label, used, limit, showBar = true, className }) => {
  const percent = limit > 0 ? Math.min(100, (used / limit) * 100) : 0;

  return (
    <div className={cn("space-y-3 px-6 py-5", className)}>
      <span className='inline-flex size-8 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300'>
        {icon}
      </span>
      <div className='flex items-baseline justify-between gap-2'>
        <p className='text-sm font-medium text-zinc-700 dark:text-zinc-300'>
          {label}
        </p>
        <p className='text-sm tabular-nums text-zinc-500 dark:text-zinc-400'>
          <span className='font-medium text-zinc-900 dark:text-zinc-100'>
            {used.toLocaleString()}
          </span>{" "}
          / {limit.toLocaleString()}
        </p>
      </div>
      {showBar && (
        <div
          role='progressbar'
          aria-label={label}
          aria-valuenow={used}
          aria-valuemax={limit}
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
      )}
    </div>
  );
};

export default UsageStat;

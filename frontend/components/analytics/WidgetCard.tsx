import React, { FC, PropsWithChildren, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  title?: ReactNode;
  action?: ReactNode;
  className?: string;
}

const WidgetCard: FC<PropsWithChildren<Props>> = ({
  title,
  action,
  className,
  children,
}) => {
  return (
    <div
      className={cn(
        "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5",
        className,
      )}
    >
      {(title || action) && (
        <div className='flex items-center justify-between mb-4'>
          {title ? (
            <h3 className='text-sm font-semibold text-zinc-800 dark:text-zinc-100'>
              {title}
            </h3>
          ) : (
            <span />
          )}
          {action}
        </div>
      )}
      {children}
    </div>
  );
};

export default WidgetCard;

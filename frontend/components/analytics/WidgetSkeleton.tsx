import React, { FC } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  rows?: number;
}

const WidgetSkeleton: FC<Props> = ({ rows = 5 }) => {
  return (
    <div className='space-y-2.5'>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton
          key={i}
          className='h-7 w-full bg-zinc-100 dark:bg-zinc-800'
        />
      ))}
    </div>
  );
};

export default WidgetSkeleton;

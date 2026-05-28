"use client";

import React, { FC } from "react";
import { CrownIcon } from "@phosphor-icons/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const DomainProLock: FC = () => {
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type='button'
            aria-disabled
            className='inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 cursor-not-allowed'
          >
            <CrownIcon size={14} weight='fill' className='text-amber-500' />
            Domain
            <span className='text-[10px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400'>
              Pro
            </span>
          </button>
        </TooltipTrigger>
        <TooltipContent
          side='bottom'
          className='bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900'
        >
          Custom domains are available on the Pro plan. Coming soon.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DomainProLock;

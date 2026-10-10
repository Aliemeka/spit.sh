"use client";
import { useClipboard } from "@/hooks/useClipboard";
import { cn } from "@/lib/utils";
import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import React from "react";

interface CopyCommandProps {
  command: string;
  className?: string;
}

const CopyCommand = ({ command, className }: CopyCommandProps) => {
  const { copied, copyToClipboard } = useClipboard({
    resetAfter: 2000,
    showToast: false,
  });

  return (
    <button
      type='button'
      onClick={() => copyToClipboard(command)}
      aria-label={`Copy "${command}"`}
      className={cn(
        "group grid max-w-full cursor-pointer rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 font-mono text-xs text-zinc-300 transition hover:border-fuchsia-400/40 focus:outline-none focus-visible:ring-4 focus-visible:ring-fuchsia-500/30 sm:text-sm",
        className,
      )}
    >
      <span
        className={`col-start-1 row-start-1 flex items-center gap-3 transition duration-300 ease-out ${
          copied ? "-translate-y-2 opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <span>
          <span className='text-fuchsia-400'>$</span> {command}
        </span>
        <CopyIcon
          size={16}
          className='shrink-0 text-zinc-500 transition group-hover:text-fuchsia-400'
        />
      </span>
      <span
        aria-hidden
        className={`col-start-1 row-start-1 flex items-center justify-center gap-1.5 text-fuchsia-300 transition duration-300 ease-out ${
          copied
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        <CheckIcon size={16} weight='bold' />
        Link copied
      </span>
      <span className='sr-only' aria-live='polite'>
        {copied ? "Link copied" : ""}
      </span>
    </button>
  );
};

export default CopyCommand;

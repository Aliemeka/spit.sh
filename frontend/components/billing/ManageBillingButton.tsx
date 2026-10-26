"use client";

import { FC } from "react";
import { cn } from "@/lib/utils";
import { useBillingActions } from "@/hooks/useBillingActions";

const ManageBillingButton: FC<{
  label?: string;
  className?: string;
}> = ({ label = "Manage billing", className }) => {
  const { openPortal, pending } = useBillingActions();

  return (
    <button
      type='button'
      onClick={openPortal}
      disabled={pending !== null}
      className={cn(
        "rounded-full border border-zinc-300 px-5 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100 disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900",
        className,
      )}
    >
      {pending === "portal" ? "Opening…" : label}
    </button>
  );
};

export default ManageBillingButton;

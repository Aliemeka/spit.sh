"use client";

import { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PaymentTier } from "@/lib/types/billingTypes";
import { useBilling } from "@/hooks/useBilling";
import PaymentPlanCard from "./PaymentPlanCard";

export interface UpgradeReason {
  title: string;
  description?: string;
}

const DEFAULT_REASON: UpgradeReason = {
  title: "Do more with Spit.sh",
  description: "More links, more tracked clicks and room for your team.",
};

const UpgradeModal: FC<{
  open: boolean;
  reason?: UpgradeReason;
  onOpenChange: (open: boolean) => void;
}> = ({ open, reason = DEFAULT_REASON, onOpenChange }) => {
  const { billing } = useBilling();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-dvh w-full max-w-4xl overflow-y-auto bg-zinc-50 p-6 sm:p-8 md:pt-20 dark:bg-zinc-900'>
        <DialogHeader className='items-center text-center sm:text-center'>
          <span className='rounded-full border border-fuchsia-200 bg-fuchsia-50 px-3 py-1 text-base font-semibold uppercase tracking-wider text-fuchsia-700 dark:border-fuchsia-900 dark:bg-fuchsia-950/50 dark:text-fuchsia-300'>
            Upgrade
          </span>
          <DialogTitle className='pt-2 text-2xl font-semibold tracking-tight'>
            {reason.title}
          </DialogTitle>
          {reason.description && (
            <DialogDescription>{reason.description}</DialogDescription>
          )}
        </DialogHeader>

        <div className='flex flex-col md:flex-row justify-center w-full gap-4 overflow-scroll'>
          {Object.values(PaymentTier).map((tier) => (
            <PaymentPlanCard key={tier} tier={tier} billing={billing} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal;

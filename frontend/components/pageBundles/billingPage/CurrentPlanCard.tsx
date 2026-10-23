import { FC } from "react";
import ManageBillingButton from "@/components/billing/ManageBillingButton";import { formatUtcDate } from "@/lib/utils";
import { PAID_PLANS } from "@/lib/constants/plans";
import { BillingState, SubscriptionStatus } from "@/lib/types/billingTypes";
import UpgradePlanButton from "./UpgradePlanButton";

const STATUS_LABELS: Partial<Record<SubscriptionStatus, string>> = {
  trialing: "Trial",
  past_due: "Payment failed",
  unpaid: "On hold",
};

const CurrentPlanCard: FC<{ projectSlug: string; billing: BillingState }> = ({
  projectSlug,
  billing,
}) => {
  const planName =
    billing.tier === "free" ? "Free" : PAID_PLANS[billing.tier].name;
  const statusLabel = billing.status ? STATUS_LABELS[billing.status] : null;
  const isUnpaid = billing.status === "unpaid";

  return (
    <section className='flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900'>
      <div>
        <p className='mb-2 text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500'>
          Current plan
        </p>
        <div className='flex items-center gap-2'>
          <h2 className='text-2xl font-semibold text-zinc-900 dark:text-zinc-100'>
            {planName} Plan
          </h2>
          {statusLabel && (
            <span className='rounded-full border border-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:text-zinc-300'>
              {statusLabel}
            </span>
          )}
        </div>
        <p className='mt-2 text-sm text-zinc-500 dark:text-zinc-400'>
          <span className='font-medium text-zinc-700 dark:text-zinc-300'>
            Current billing cycle:
          </span>{" "}
          {formatUtcDate(billing.current_period_start)} –{" "}
          {formatUtcDate(billing.current_period_end)}
        </p>
      </div>

      {billing.tier === "free" && !isUnpaid && <UpgradePlanButton />}
      {billing.tier !== "free" && (
        <ManageBillingButton projectSlug={projectSlug} className='rounded-lg' />
      )}
    </section>
  );
};

export default CurrentPlanCard;

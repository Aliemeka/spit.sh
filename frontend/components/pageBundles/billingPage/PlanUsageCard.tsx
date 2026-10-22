import { FC } from "react";
import UsageMeter from "@/components/billing/UsageMeter";
import ManageBillingButton from "@/components/billing/ManageBillingButton";
import { formatUtcDate } from "@/lib/utils";
import { PAID_PLANS, USAGE_LABELS } from "@/lib/constants/plans";
import {
  BillingState,
  BillingUsage,
  SubscriptionStatus,
} from "@/lib/types/billingTypes";

const STATUS_LABELS: Partial<Record<SubscriptionStatus, string>> = {
  trialing: "Trial",
  active: "Active",
  past_due: "Payment failed",
  unpaid: "On hold",
};

const PlanUsageCard: FC<{ projectSlug: string; billing: BillingState }> = ({
  projectSlug,
  billing,
}) => {
  const planName =
    billing.tier === "free" ? "Free" : PAID_PLANS[billing.tier].name;
  const statusLabel = billing.status ? STATUS_LABELS[billing.status] : null;

  return (
    <section className='rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950'>
      <div className='flex flex-wrap items-start justify-between gap-4 p-6'>
        <div className='space-y-1'>
          <p className='text-sm text-zinc-500 dark:text-zinc-400'>
            Current plan
          </p>
          <div className='flex items-center gap-2'>
            <h2 className='text-2xl font-semibold text-zinc-900 dark:text-zinc-50'>
              {planName}
            </h2>
            {statusLabel && (
              <span className='rounded-full border border-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:text-zinc-300'>
                {statusLabel}
              </span>
            )}
          </div>
          <p className='text-sm text-zinc-500 dark:text-zinc-400'>
            Current billing cycle: {formatUtcDate(billing.current_period_start)}{" "}
            – {formatUtcDate(billing.current_period_end)}
          </p>
        </div>

        {billing.status && billing.status !== "unpaid" && (
          <ManageBillingButton projectSlug={projectSlug} />
        )}
      </div>

      <div className='grid gap-6 border-t border-zinc-200 p-6 sm:grid-cols-3 dark:border-zinc-800'>
        {(Object.keys(USAGE_LABELS) as (keyof BillingUsage)[]).map((key) => (
          <UsageMeter
            key={key}
            label={USAGE_LABELS[key]}
            metric={billing.usage[key]}
          />
        ))}
      </div>
      <p className='border-t border-zinc-200 px-6 py-3 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400'>
        Usage resets on {formatUtcDate(billing.current_period_end)}.
      </p>
    </section>
  );
};

export default PlanUsageCard;

"use client";

import { FC } from "react";
import { CheckIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useDisplayCurrency } from "@/hooks/useBilling";
import { useBillingActions } from "@/hooks/useBillingActions";
import { BillingState, PaymentTier } from "@/lib/types/billingTypes";
import { PAID_PLANS, TRIAL_DAYS, formatPrice } from "@/lib/constants/plans";
import {
  body,
  btnGhost,
  btnPrimary,
  card,
  heading,
} from "@/components/pageBundles/landingPage/tokens";
import UnpaidActions from "./UnpaidActions";

const PaymentPlanCard: FC<{
  projectSlug: string;
  tier: PaymentTier;
  billing: BillingState | undefined;
  className?: string;
}> = ({ projectSlug, tier, billing, className }) => {
  const plan = PAID_PLANS[tier];
  const currency = useDisplayCurrency();
  const { startCheckout, openPortal, pending } = useBillingActions(projectSlug);

  const isUnpaid = billing?.status === "unpaid";
  const isCurrentPlan = billing?.tier === tier;
  const trialEligible = billing?.trial_eligible ?? false;

  return (
    <article
      className={cn(
        card,
        "relative flex flex-col gap-6 p-6 md:p-8 !border-fuchsia-500/40 ring-4 ring-fuchsia-500/10 max-w-[450px]",
        className,
      )}
    >
      {isCurrentPlan && (
        <span className='absolute right-6 top-6 rounded-full bg-fuchsia-600 px-2.5 py-1 text-[11px] font-semibold text-white dark:bg-fuchsia-500'>
          Current plan
        </span>
      )}

      <div>
        <h3 className={`${heading} text-lg font-semibold`}>{plan.name}</h3>
        <p className={`${body} mt-1 text-sm`}>{plan.description}</p>
      </div>

      <p className='flex items-baseline gap-2'>
        <span className={`${heading} text-5xl font-bold`}>
          {formatPrice(plan.monthlyPrice[currency], currency)}
        </span>
        <span className='text-sm text-zinc-500'>per project / month</span>
      </p>

      {isUnpaid ? (
        <UnpaidActions projectSlug={projectSlug} />
      ) : isCurrentPlan ? (
        <button
          type='button'
          onClick={openPortal}
          disabled={pending !== null}
          className={cn(btnGhost, "disabled:opacity-60")}
        >
          {pending === "portal" ? "Opening…" : "Manage billing"}
        </button>
      ) : (
        <div className='flex flex-col gap-2'>
          <button
            type='button'
            onClick={() => startCheckout(tier, currency)}
            disabled={pending !== null || !billing}
            className={cn(btnPrimary, "disabled:opacity-60")}
          >
            {pending === "checkout"
              ? "Redirecting to checkout…"
              : trialEligible
                ? `Start ${TRIAL_DAYS}-day free trial`
                : `Upgrade to ${plan.name}`}
          </button>
          {trialEligible && (
            <p className='text-center text-xs text-zinc-500'>
              Card required. No charge today.
            </p>
          )}
        </div>
      )}

      <ul className='flex flex-col gap-3 border-t border-zinc-900/10 pt-6 dark:border-white/10'>
        {plan.features.map((feature) => (
          <li
            key={feature.label}
            className='flex items-start gap-2.5 text-sm text-zinc-700 dark:text-zinc-300'
          >
            <CheckIcon
              size={16}
              weight='bold'
              className='mt-0.5 shrink-0 text-fuchsia-600 dark:text-fuchsia-400'
            />
            <span>{feature.label}</span>
            {feature.soon && (
              <span className='rounded-full border border-zinc-900/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-500 dark:border-white/10'>
                Soon
              </span>
            )}
          </li>
        ))}
      </ul>
    </article>
  );
};

export default PaymentPlanCard;

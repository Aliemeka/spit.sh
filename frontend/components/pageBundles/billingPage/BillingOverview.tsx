import { getBillingAction } from "@/app/actions/billing";
import BillingStatusCallout from "@/components/billing/BillingStatusCallout";
import PaymentPlanCard from "@/components/billing/PaymentPlanCard";
import { BillingState, PaymentTier } from "@/lib/types/billingTypes";
import CheckoutActivation from "./CheckoutActivation";
import PlanUsageCard from "./PlanUsageCard";

interface Props {
  projectSlug: string;
  checkoutSuccess: boolean;
}

const BillingOverview = async ({ projectSlug, checkoutSuccess }: Props) => {
  let billing: BillingState;
  try {
    billing = await getBillingAction(projectSlug);
  } catch {
    return (
      <p className='text-sm text-zinc-500 dark:text-zinc-400'>
        We couldn&apos;t load billing details. Refresh the page to try again.
      </p>
    );
  }

  const showUpgrade = billing.tier === "free" && billing.status !== "unpaid";

  return (
    <div className='max-w-4xl space-y-6'>
      {checkoutSuccess ? (
        <CheckoutActivation
          projectSlug={projectSlug}
          isPaid={billing.tier !== "free"}
        />
      ) : (
        <BillingStatusCallout projectSlug={projectSlug} billing={billing} />
      )}

      <PlanUsageCard projectSlug={projectSlug} billing={billing} />

      {showUpgrade && (
        <section className='space-y-3'>
          <h2 className='text-lg font-semibold text-zinc-900 dark:text-zinc-100'>
            Upgrade your plan
          </h2>
          <div className='grid gap-6 md:grid-cols-2'>
            {Object.values(PaymentTier).map((tier) => (
              <PaymentPlanCard
                key={tier}
                projectSlug={projectSlug}
                tier={tier}
                billing={billing}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default BillingOverview;

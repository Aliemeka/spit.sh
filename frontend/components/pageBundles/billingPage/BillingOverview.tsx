import { CreditCardIcon } from "@phosphor-icons/react/dist/ssr";
import { getBillingAction } from "@/app/actions/billing";
import BillingStatusCallout from "@/components/billing/BillingStatusCallout";
import TabbedCard from "@/components/blocks/TabbedCard";
import { BillingState } from "@/lib/types/billingTypes";
import CheckoutActivation from "./CheckoutActivation";
import CurrentPlanCard from "./CurrentPlanCard";
import InvoicesTable from "./InvoicesTable";
import MonthlyUsageCard from "./MonthlyUsageCard";

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

  return (
    <div className='mt-4 max-w-4xl space-y-6 md:space-y-10'>
      {checkoutSuccess ? (
        <CheckoutActivation isPaid={billing.tier !== "free"} />
      ) : (
        <BillingStatusCallout billing={billing} />
      )}

      <CurrentPlanCard billing={billing} />

      <MonthlyUsageCard billing={billing} />

      <section className='space-y-3'>
        <h2 className='text-base font-semibold text-zinc-900 dark:text-zinc-50'>
          Invoices
        </h2>
        <TabbedCard
          tabs={[
            {
              value: "subscription",
              label: "Subscription",
              icon: <CreditCardIcon size={16} />,
              content: <InvoicesTable invoices={[]} />,
            },
          ]}
        />
      </section>
    </div>
  );
};

export default BillingOverview;

import { FC } from "react";
import { formatUtcDate } from "@/lib/utils";
import { BillingState } from "@/lib/types/billingTypes";
import Callout from "./Callout";
import ManageBillingButton from "./ManageBillingButton";
import UnpaidActions from "./UnpaidActions";

const BillingStatusCallout: FC<{ billing: BillingState }> = ({ billing }) => {
  if (billing.status === "unpaid") {
    return (
      <Callout
        tone='danger'
        title='Your Pro plan is on hold'
        action={<UnpaidActions />}
      >
        We couldn&apos;t collect your last payment, so this project is on Free
        limits. Pay the outstanding invoice to restore Pro, or switch to Free.
      </Callout>
    );
  }

  if (billing.status === "past_due") {
    return (
      <Callout
        tone='warning'
        title='Payment failed'
        action={<ManageBillingButton label='Update payment method' />}
      >
        We&apos;ll retry automatically over the next few days. Update your
        payment method to keep Pro.
      </Callout>
    );
  }

  if (billing.status === "trialing" && billing.trial_end) {
    return (
      <Callout tone='info' title='You are on a free trial'>
        Your trial ends on {formatUtcDate(billing.trial_end)}. Your card will be
        charged then unless you cancel.
      </Callout>
    );
  }

  if (billing.cancel_at_period_end) {
    return (
      <Callout tone='warning' title='Your plan is cancelled'>
        Pro stays active until {formatUtcDate(billing.current_period_end)}, then
        this project moves to Free.
      </Callout>
    );
  }

  const events = billing.usage.events_per_period;
  if (events.used >= events.limit) {
    return (
      <Callout tone='warning' title='Click tracking is paused'>
        You&apos;ve reached this period&apos;s tracked click limit. Your links
        still redirect, but new clicks aren&apos;t recorded until{" "}
        {formatUtcDate(billing.current_period_end)}.
      </Callout>
    );
  }

  return null;
};

export default BillingStatusCallout;

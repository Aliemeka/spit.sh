import { FC } from "react";
import {
  CursorClickIcon,
  GlobeIcon,
  LinkSimpleIcon,
  UsersIcon,
} from "@phosphor-icons/react/dist/ssr";
import UsageStat from "@/components/billing/UsageStat";import { formatUtcDate } from "@/lib/utils";
import { BillingState } from "@/lib/types/billingTypes";

const MonthlyUsageCard: FC<{ billing: BillingState }> = ({ billing }) => {
  const { usage, entitlements } = billing;
  const iconProps = { size: 16, weight: "bold" } as const;

  return (
    <section className='overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'>
      <h2 className='px-6 pb-4 pt-6 text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500'>
        Monthly usage
      </h2>

      <div className='divide-y divide-zinc-200 border-t border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800'>
        <UsageStat
          icon={<LinkSimpleIcon {...iconProps} />}
          label='Links created'
          used={usage.links_per_period.used}
          limit={usage.links_per_period.limit}
        />
        <UsageStat
          icon={<CursorClickIcon {...iconProps} />}
          label='Tracked clicks'
          used={usage.events_per_period.used}
          limit={usage.events_per_period.limit}
        />
        <div className='grid divide-y divide-zinc-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0 dark:divide-zinc-800'>
          <UsageStat
            icon={<UsersIcon {...iconProps} />}
            label='Team members'
            used={usage.seats.used}
            limit={usage.seats.limit}
            showBar={false}
          />
          <UsageStat
            icon={<GlobeIcon {...iconProps} />}
            label='Custom domains'
            used={0}
            limit={Number(entitlements.custom_domains ?? 0)}
            showBar={false}
          />
        </div>
      </div>

      <p className='border-t border-zinc-200 px-6 py-3 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400'>
        Usage resets on {formatUtcDate(billing.current_period_end)}.
      </p>
    </section>
  );
};

export default MonthlyUsageCard;

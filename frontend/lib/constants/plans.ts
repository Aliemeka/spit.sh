import { BillingCurrency, PaymentTier } from "@/lib/types/billingTypes";

export interface PlanFeature {
  label: string;
  soon?: boolean;
}

export interface PlanConfig {
  name: string;
  description: string;
  monthlyPrice: Record<BillingCurrency, number>;
  features: PlanFeature[];
}

export const TRIAL_DAYS = 14;

// Prices must match the Bachs product prices.
export const PAID_PLANS: Record<PaymentTier, PlanConfig> = {
  [PaymentTier.Pro]: {
    name: "Pro",
    description: "For growing teams who want their brand on every link.",
    monthlyPrice: {
      [BillingCurrency.USD]: 15,
      [BillingCurrency.NGN]: 20000,
    },
    features: [
      { label: "1,000 links / month" },
      { label: "50,000 tracked clicks / month" },
      { label: "10 seats", soon: true },
      { label: "3 custom domains", soon: true },
      { label: "Dynamic links with geo & device targeting", soon: true },
      { label: "365-day analytics history", soon: true },
      { label: "Password & expiring links", soon: true },
      { label: "CSV export & bulk import", soon: true },
      { label: "Priority support" },
    ],
  },
};

const replaceWithCurrencyWithoutSymbol = (currency: string) => {
  switch (currency) {
    case BillingCurrency.USD:
      return "$";
    case BillingCurrency.NGN:
      return "₦";
    default:
      return currency;
  }
};

export function formatPrice(amount: number, currency: BillingCurrency) {
  const formatted = new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);

  return formatted.replace(
    currency,
    replaceWithCurrencyWithoutSymbol(currency),
  );
}

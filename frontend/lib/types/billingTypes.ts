export enum PaymentTier {
  Pro = "pro",
}

export type PlanTier = "free" | PaymentTier;

export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "unpaid"
  | "canceled";

export enum BillingCurrency {
  USD = "USD",
  NGN = "NGN",
}

export interface UsageMetric {
  used: number;
  limit: number;
}

export interface BillingUsage {
  links_per_period: UsageMetric;
  events_per_period: UsageMetric;
  seats: UsageMetric;
}

export interface Invoice {
  id: string;
  number: string;
  created_at: string;
  amount: number;
  currency: BillingCurrency;
  status: "paid" | "open" | "void";
}

export interface BillingState {
  tier: PlanTier;
  status: SubscriptionStatus | null;
  currency: string | null;
  trial_end: string | null;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  past_due_since: string | null;
  trial_eligible: boolean;
  usage: BillingUsage;
  entitlements: Record<string, number | boolean | null>;
}

from datetime import datetime
from pydantic import BaseModel

from models.billing import BillingCurrency, PlanTier, SubscriptionStatus


class CheckoutRequest(BaseModel):
    tier: PlanTier
    currency: BillingCurrency | None = None


class CheckoutResponse(BaseModel):
    checkout_url: str


class PortalResponse(BaseModel):
    portal_url: str


class UsageMetric(BaseModel):
    used: int
    limit: int


class BillingUsage(BaseModel):
    links_per_period: UsageMetric
    events_per_period: UsageMetric
    seats: UsageMetric


class BillingState(BaseModel):
    tier: PlanTier
    status: SubscriptionStatus | None
    currency: str | None
    trial_end: datetime | None
    current_period_start: datetime
    current_period_end: datetime
    cancel_at_period_end: bool
    past_due_since: datetime | None
    trial_eligible: bool
    usage: BillingUsage
    entitlements: dict[str, int | bool | None]

import uuid
from dataclasses import dataclass
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession

from config.plans import PLANS, PlanLimits
from crud import billing as billing_crud
from crud.billing import UsageCounter
from models.billing import PlanTier, ProjectSubscription, SubscriptionStatus

PAID_STATUSES = {
    SubscriptionStatus.Trialing,
    SubscriptionStatus.Active,
    SubscriptionStatus.Past_due,
}


class PlanLimitReached(Exception):
    def __init__(self, limit: str, current: int, max: int, tier: PlanTier):
        self.detail = {
            "code": "plan_limit_reached",
            "limit": limit,
            "current": current,
            "max": max,
            "tier": tier.value,
        }


class FeatureNotInPlan(Exception):
    def __init__(self, feature: str, tier: PlanTier):
        self.detail = {
            "code": "feature_not_in_plan",
            "feature": feature,
            "tier": tier.value,
        }


@dataclass(frozen=True)
class Plan:
    tier: PlanTier
    limits: PlanLimits
    period_start: datetime
    period_end: datetime
    subscription: ProjectSubscription | None


def _utc_now() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


def _calendar_month(now: datetime) -> tuple[datetime, datetime]:
    start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    if start.month == 12:
        return start, start.replace(year=start.year + 1, month=1)
    return start, start.replace(month=start.month + 1)


def effective_tier(subscription: ProjectSubscription | None) -> PlanTier:
    if subscription and subscription.status in PAID_STATUSES:
        return subscription.tier
    return PlanTier.Free


async def get_plan(project_id: uuid.UUID, db: AsyncSession) -> Plan:
    subscription = await billing_crud.get_project_subscription(project_id, db)
    tier = effective_tier(subscription)
    if tier == PlanTier.Free:
        period_start, period_end = _calendar_month(_utc_now())
    else:
        period_start = subscription.current_period_start
        period_end = subscription.current_period_end
    return Plan(tier, PLANS[tier], period_start, period_end, subscription)


async def _consume(
    project_id: uuid.UUID, counter: UsageCounter, limit: int, db: AsyncSession
) -> tuple[Plan, bool]:
    plan = await get_plan(project_id, db)
    await billing_crud.ensure_usage_row(
        project_id, plan.period_start, plan.period_end, db
    )
    new_value = await billing_crud.increment_usage_if_below(
        project_id, plan.period_start, counter, getattr(plan.limits, limit), db
    )
    return plan, new_value is not None


async def reserve_link(project_id: uuid.UUID, db: AsyncSession) -> None:
    """Counts a new link against the quota. Must share the link insert's transaction."""
    plan, allowed = await _consume(project_id, "links_created", "links_per_period", db)
    if not allowed:
        usage = await billing_crud.get_usage(project_id, plan.period_start, db)
        raise PlanLimitReached(
            "links_per_period",
            usage.links_created if usage else 0,
            plan.limits.links_per_period,
            plan.tier,
        )


async def track_event(project_id: uuid.UUID, db: AsyncSession) -> bool:
    """Counts a click against the quota. False means over the limit: skip recording it."""
    _, allowed = await _consume(project_id, "events_tracked", "events_per_period", db)
    return allowed


async def check_seats(project_id: uuid.UUID, db: AsyncSession, adding: int = 1) -> None:
    plan = await get_plan(project_id, db)
    members = await billing_crud.count_project_members(project_id, db)
    if members + adding > plan.limits.seats:
        raise PlanLimitReached("seats", members, plan.limits.seats, plan.tier)


def require_feature(plan: Plan, feature: str) -> None:
    if not getattr(plan.limits, feature):
        raise FeatureNotInPlan(feature, plan.tier)

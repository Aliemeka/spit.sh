import logging
import uuid
from dataclasses import asdict
from datetime import datetime, timezone
from typing import Any
from sqlalchemy.ext.asyncio import AsyncSession

from config.environment import FRONTEND_URL
from config.plans import product_for_tier, tier_for_product
from crud import billing as billing_crud
from crud.project import get_project_owner_id
from crud.user import find_user_by_id
from models.billing import (
    BillingCurrency,
    BillingProvider,
    PlanTier,
    ProjectSubscription,
    SubscriptionStatus,
)
from models.project import Project
from schemas.billingSchema import BillingState, BillingUsage, UsageMetric
from services import bachs_client
from services.entitlements import PAID_STATUSES, get_plan
from utils.generate import generate_reference

logger = logging.getLogger(__name__)

PROVIDER = BillingProvider.Bachs
QUOTA_FIELDS = {"links_per_period", "events_per_period", "seats"}
SUBSCRIPTION_EVENTS = {
    "customer.subscription.created",
    "customer.subscription.updated",
    "customer.subscription.deleted",
}


class SubscriptionExists(Exception):
    pass


class OutstandingPayment(Exception):
    pass


class NoBillingCustomer(Exception):
    pass


class NotUnpaid(Exception):
    pass


class UnsupportedTier(Exception):
    pass


def _utc_now() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


def _parse_time(value: str | None) -> datetime | None:
    if not value:
        return None
    return datetime.fromisoformat(value).astimezone(timezone.utc).replace(tzinfo=None)


def _billing_page_url(project_slug: str) -> str:
    return f"{FRONTEND_URL}/dashboard/settings/billing?ws={project_slug}"


async def get_billing_state(project: Project, db: AsyncSession) -> BillingState:
    plan = await get_plan(project.id, db)
    subscription = plan.subscription
    usage = await billing_crud.get_usage(project.id, plan.period_start, db)
    members = await billing_crud.count_project_members(project.id, db)
    owner_id = await get_project_owner_id(project.id, db)
    owner = await find_user_by_id(owner_id, db) if owner_id else None

    return BillingState(
        tier=plan.tier,
        status=subscription.status if subscription else None,
        currency=subscription.currency if subscription else None,
        trial_end=subscription.trial_end if subscription else None,
        current_period_start=plan.period_start,
        current_period_end=plan.period_end,
        cancel_at_period_end=(
            subscription.cancel_at_period_end if subscription else False
        ),
        past_due_since=subscription.past_due_since if subscription else None,
        trial_eligible=owner is not None and owner.trial_used_at is None,
        usage=BillingUsage(
            links_per_period=UsageMetric(
                used=usage.links_created if usage else 0,
                limit=plan.limits.links_per_period,
            ),
            events_per_period=UsageMetric(
                used=usage.events_tracked if usage else 0,
                limit=plan.limits.events_per_period,
            ),
            seats=UsageMetric(used=members, limit=plan.limits.seats),
        ),
        entitlements={
            key: value
            for key, value in asdict(plan.limits).items()
            if key not in QUOTA_FIELDS
        },
    )


async def start_checkout(
    project: Project,
    owner_id: uuid.UUID,
    tier: PlanTier,
    currency: BillingCurrency | None,
    db: AsyncSession,
) -> str:
    subscription = await billing_crud.get_project_subscription(project.id, db)
    if subscription and subscription.status == SubscriptionStatus.Unpaid:
        raise OutstandingPayment
    if subscription and subscription.status in PAID_STATUSES:
        raise SubscriptionExists

    owner = await find_user_by_id(owner_id, db)
    product_id = product_for_tier(tier, with_trial=owner.trial_used_at is None)
    if not product_id:
        raise UnsupportedTier

    billing_customer = await billing_crud.get_billing_customer(owner.id, PROVIDER, db)
    if billing_customer:
        customer = {"customer_id": billing_customer.provider_customer_id}
    else:
        customer = {"email": owner.email}
        name = " ".join(filter(None, [owner.first_name, owner.last_name]))
        if name:
            customer["name"] = name

    billing_page = _billing_page_url(project.slug)
    return await bachs_client.create_checkout_session(
        product_id=product_id,
        customer=customer,
        success_url=f"{billing_page}&checkout=success",
        cancel_url=billing_page,
        metadata={"project_id": str(project.id), "owner_user_id": str(owner.id)},
        reference=f"{project.id}:{generate_reference()}",
        billing_currency=currency,
    )


async def open_portal(owner_id: uuid.UUID, db: AsyncSession) -> str:
    billing_customer = await billing_crud.get_billing_customer(owner_id, PROVIDER, db)
    if not billing_customer:
        raise NoBillingCustomer
    return await bachs_client.create_portal_session(
        billing_customer.provider_customer_id
    )


async def switch_to_free(project: Project, db: AsyncSession) -> BillingState:
    subscription = await billing_crud.get_project_subscription(project.id, db)
    if not subscription or subscription.status != SubscriptionStatus.Unpaid:
        raise NotUnpaid

    await bachs_client.cancel_subscription(subscription.provider_subscription_id)

    now = _utc_now()
    subscription.status = SubscriptionStatus.Canceled
    subscription.last_event_at = now
    subscription.updated_at = now
    db.add(subscription)
    await db.commit()
    return await get_billing_state(project, db)


async def handle_webhook(raw_body: bytes, headers: Any, db: AsyncSession) -> None:
    event = bachs_client.verify_webhook(raw_body, headers)
    event_type = event["type"]

    if not await billing_crud.record_billing_event(
        PROVIDER, event["id"], event_type, db
    ):
        return

    data = event.get("data") or {}
    event_at = _parse_time(event["created_at"])

    if event_type in SUBSCRIPTION_EVENTS:
        await _apply_subscription_event(event_type, data, event_at, db)
    elif event_type == "invoice.payment_failed":
        subscription = await _invoice_subscription(data, db)
        if subscription and subscription.past_due_since is None:
            subscription.past_due_since = event_at
            db.add(subscription)
    elif event_type == "invoice.paid":
        subscription = await _invoice_subscription(data, db)
        if subscription:
            subscription.past_due_since = None
            db.add(subscription)
    else:
        logger.info("Ignoring Bachs event %s (%s)", event["id"], event_type)

    await db.commit()


async def _invoice_subscription(
    data: dict[str, Any], db: AsyncSession
) -> ProjectSubscription | None:
    subscription_id = (data.get("subscription") or {}).get("subscription_id")
    if not subscription_id:
        return None
    return await billing_crud.get_subscription_by_provider_id(
        PROVIDER, subscription_id, db
    )


async def _apply_subscription_event(
    event_type: str, data: dict[str, Any], event_at: datetime, db: AsyncSession
) -> None:
    subscription_id = data["subscription_id"]
    metadata = data.get("metadata") or {}

    existing = await billing_crud.get_subscription_by_provider_id(
        PROVIDER, subscription_id, db
    )
    if existing:
        project_id = existing.project_id
    else:
        if not metadata.get("project_id"):
            logger.warning("Bachs subscription %s has no project_id", subscription_id)
            return
        project_id = uuid.UUID(metadata["project_id"])
        existing = await billing_crud.get_project_subscription(project_id, db)
        # A project's row only moves to a new subscription once the old one has ended,
        # so late events from a previous subscription can't overwrite the current one.
        if existing and existing.status != SubscriptionStatus.Canceled:
            logger.warning(
                "Ignoring %s for %s: project %s is on subscription %s",
                event_type,
                subscription_id,
                project_id,
                existing.provider_subscription_id,
            )
            return

    if existing and existing.provider_subscription_id == subscription_id:
        if existing.last_event_at > event_at:
            return

    tier = tier_for_product(data["product_id"])
    if tier is None:
        logger.warning("Bachs product %s doesn't map to a tier", data["product_id"])
        return

    if metadata.get("owner_user_id"):
        payer_user_id = uuid.UUID(metadata["owner_user_id"])
    elif existing:
        payer_user_id = existing.payer_user_id
    else:
        logger.warning("Bachs subscription %s has no owner_user_id", subscription_id)
        return

    if event_type == "customer.subscription.deleted":
        status = SubscriptionStatus.Canceled
    else:
        status = bachs_client.to_subscription_status(data["status"])

    fields = {
        "payer_user_id": payer_user_id,
        "provider": PROVIDER,
        "provider_subscription_id": subscription_id,
        "provider_product_id": data["product_id"],
        "tier": tier,
        "status": status,
        "currency": data["currency"],
        "current_period_start": _parse_time(data["current_period_start"]),
        "current_period_end": _parse_time(data["current_period_end"]),
        "trial_end": _parse_time(data.get("trial_end")),
        "cancel_at_period_end": bool(data.get("cancel_at_period_end")),
        "last_event_at": event_at,
        "updated_at": _utc_now(),
    }
    if existing is None:
        subscription = ProjectSubscription(project_id=project_id, **fields)
    else:
        if existing.provider_subscription_id != subscription_id:
            existing.past_due_since = None
        subscription = existing
        for key, value in fields.items():
            setattr(subscription, key, value)

    if status == SubscriptionStatus.Active:
        subscription.past_due_since = None
    elif status == SubscriptionStatus.Past_due and subscription.past_due_since is None:
        subscription.past_due_since = event_at
    db.add(subscription)

    customer_id = (data.get("customer") or {}).get("customer_id")
    if customer_id:
        await billing_crud.ensure_billing_customer(
            payer_user_id, PROVIDER, customer_id, db
        )
    if status == SubscriptionStatus.Trialing:
        await billing_crud.mark_trial_used(payer_user_id, event_at, db)

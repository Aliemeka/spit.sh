import uuid
from datetime import datetime
from typing import Literal
from sqlalchemy import func, update
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.dialects.sqlite import insert as sqlite_insert
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import col

from models.billing import (
    BillingCustomer,
    BillingEvent,
    BillingProvider,
    ProjectSubscription,
    ProjectUsage,
)
from models.project import ProjectUsers
from models.user import User

UsageCounter = Literal["links_created", "events_tracked"]


def _insert(db: AsyncSession):
    return pg_insert if db.bind.dialect.name == "postgresql" else sqlite_insert


async def get_project_subscription(
    project_id: uuid.UUID, db: AsyncSession
) -> ProjectSubscription | None:
    result = await db.execute(
        select(ProjectSubscription).where(ProjectSubscription.project_id == project_id)
    )
    return result.scalars().one_or_none()


async def ensure_usage_row(
    project_id: uuid.UUID,
    period_start: datetime,
    period_end: datetime,
    db: AsyncSession,
) -> None:
    stmt = (
        _insert(db)(ProjectUsage)
        .values(project_id=project_id, period_start=period_start, period_end=period_end)
        .on_conflict_do_nothing(index_elements=["project_id", "period_start"])
    )
    await db.execute(stmt)


async def get_usage(
    project_id: uuid.UUID, period_start: datetime, db: AsyncSession
) -> ProjectUsage | None:
    result = await db.execute(
        select(ProjectUsage).where(
            ProjectUsage.project_id == project_id,
            ProjectUsage.period_start == period_start,
        )
    )
    return result.scalars().one_or_none()


async def increment_usage_if_below(
    project_id: uuid.UUID,
    period_start: datetime,
    counter: UsageCounter,
    limit: int,
    db: AsyncSession,
) -> int | None:
    """Atomically adds 1 to the counter unless it has reached `limit`.

    Returns the new value, or None when the limit was already reached.
    Does not commit: the caller's commit makes the increment permanent, and a
    rollback (e.g. a failed link insert) undoes it.
    """
    column = getattr(ProjectUsage, counter)
    stmt = (
        update(ProjectUsage)
        .where(
            ProjectUsage.project_id == project_id,
            ProjectUsage.period_start == period_start,
            column < limit,
        )
        .values({counter: column + 1})
        .returning(column)
    )
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def get_subscription_by_provider_id(
    provider: BillingProvider, subscription_id: str, db: AsyncSession
) -> ProjectSubscription | None:
    result = await db.execute(
        select(ProjectSubscription).where(
            ProjectSubscription.provider == provider,
            ProjectSubscription.provider_subscription_id == subscription_id,
        )
    )
    return result.scalars().one_or_none()


async def get_billing_customer(
    user_id: uuid.UUID, provider: BillingProvider, db: AsyncSession
) -> BillingCustomer | None:
    return await db.get(BillingCustomer, (user_id, provider))


async def ensure_billing_customer(
    user_id: uuid.UUID,
    provider: BillingProvider,
    provider_customer_id: str,
    db: AsyncSession,
) -> None:
    stmt = (
        _insert(db)(BillingCustomer)
        .values(
            user_id=user_id,
            provider=provider,
            provider_customer_id=provider_customer_id,
            created_at=datetime.utcnow(),
        )
        .on_conflict_do_nothing(index_elements=["user_id", "provider"])
    )
    await db.execute(stmt)


async def record_billing_event(
    provider: BillingProvider, event_id: str, event_type: str, db: AsyncSession
) -> bool:
    """Returns False if the event was already recorded (a duplicate delivery)."""
    stmt = (
        _insert(db)(BillingEvent)
        .values(
            provider=provider,
            id=event_id,
            type=event_type,
            received_at=datetime.utcnow(),
        )
        .on_conflict_do_nothing(index_elements=["provider", "id"])
        .returning(BillingEvent.id)
    )
    result = await db.execute(stmt)
    return result.scalar_one_or_none() is not None


async def mark_trial_used(user_id: uuid.UUID, used_at: datetime, db: AsyncSession) -> None:
    await db.execute(
        update(User)
        .where(User.id == user_id, col(User.trial_used_at).is_(None))
        .values(trial_used_at=used_at)
    )


async def count_project_members(project_id: uuid.UUID, db: AsyncSession) -> int:
    result = await db.execute(
        select(func.count())
        .select_from(ProjectUsers)
        .where(ProjectUsers.project_id == project_id)
    )
    return result.scalar_one()

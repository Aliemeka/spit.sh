from datetime import datetime
import enum
import uuid
import sqlalchemy as sa
from sqlmodel import Field, SQLModel


class BillingProvider(str, enum.Enum):
    Bachs = "bachs"


class PlanTier(str, enum.Enum):
    Free = "free"
    Pro = "pro"


class SubscriptionStatus(str, enum.Enum):
    Trialing = "trialing"
    Active = "active"
    Past_due = "past_due"
    Unpaid = "unpaid"
    Canceled = "canceled"


# Stored as VARCHAR (not a native Postgres enum) so adding a provider, tier or
# status doesn't need an ALTER TYPE migration.
def _enum_column(enum_cls: type[enum.Enum]) -> sa.Enum:
    return sa.Enum(
        enum_cls,
        native_enum=False,
        length=32,
        values_callable=lambda e: [member.value for member in e],
    )


class BillingCustomer(SQLModel, table=True):
    __table_args__ = (sa.UniqueConstraint("provider", "provider_customer_id"),)

    user_id: uuid.UUID = Field(foreign_key="user.id", primary_key=True)
    provider: BillingProvider = Field(
        sa_type=_enum_column(BillingProvider), primary_key=True
    )
    provider_customer_id: str = Field(max_length=128)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)


class ProjectSubscription(SQLModel, table=True):
    __table_args__ = (sa.UniqueConstraint("provider", "provider_subscription_id"),)

    project_id: uuid.UUID = Field(foreign_key="project.id", primary_key=True)
    payer_user_id: uuid.UUID = Field(foreign_key="user.id", index=True)

    provider: BillingProvider = Field(sa_type=_enum_column(BillingProvider))
    provider_subscription_id: str = Field(max_length=128)
    provider_product_id: str = Field(max_length=128)
    tier: PlanTier = Field(sa_type=_enum_column(PlanTier))
    status: SubscriptionStatus = Field(sa_type=_enum_column(SubscriptionStatus))
    currency: str = Field(max_length=3)

    current_period_start: datetime
    current_period_end: datetime
    trial_end: datetime | None = Field(default=None, nullable=True)
    cancel_at_period_end: bool = Field(default=False)
    past_due_since: datetime | None = Field(default=None, nullable=True)
    last_event_at: datetime

    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)


class ProjectUsage(SQLModel, table=True):
    project_id: uuid.UUID = Field(
        foreign_key="project.id", primary_key=True, ondelete="CASCADE"
    )
    period_start: datetime = Field(primary_key=True)
    period_end: datetime

    links_created: int = Field(default=0)
    events_tracked: int = Field(default=0)

    links_warned_80_at: datetime | None = Field(default=None, nullable=True)
    links_warned_100_at: datetime | None = Field(default=None, nullable=True)
    events_warned_80_at: datetime | None = Field(default=None, nullable=True)
    events_warned_100_at: datetime | None = Field(default=None, nullable=True)


class BillingEvent(SQLModel, table=True):
    provider: BillingProvider = Field(
        sa_type=_enum_column(BillingProvider), primary_key=True
    )
    id: str = Field(primary_key=True, max_length=128)
    type: str = Field(max_length=64)
    received_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

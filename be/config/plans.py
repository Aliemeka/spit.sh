from dataclasses import dataclass

from config.environment import settings
from models.billing import PlanTier


@dataclass(frozen=True)
class PlanLimits:
    links_per_period: int
    events_per_period: int
    seats: int
    custom_domains: int
    link_folders: bool
    analytics_retention_days: int | None
    password_links: bool
    link_expiry: bool
    csv_export: bool
    bulk_import: bool
    priority_support: bool
    geo_device_targeting: bool


PLANS: dict[PlanTier, PlanLimits] = {
    PlanTier.Free: PlanLimits(
        links_per_period=30,
        events_per_period=5_000,
        seats=1,
        custom_domains=0,
        link_folders=False,
        analytics_retention_days=30,
        password_links=False,
        link_expiry=False,
        csv_export=False,
        bulk_import=False,
        priority_support=False,
        geo_device_targeting=False,
    ),
    PlanTier.Pro: PlanLimits(
        links_per_period=1_000,
        events_per_period=50_000,
        seats=10,
        custom_domains=3,
        link_folders=True,
        analytics_retention_days=365,
        password_links=True,
        link_expiry=True,
        csv_export=True,
        bulk_import=True,
        priority_support=True,
        geo_device_targeting=False,
    ),
}


def product_for_tier(tier: PlanTier, with_trial: bool) -> str | None:
    if tier == PlanTier.Pro:
        if with_trial:
            return settings.bachs_pro_trial_product_id
        return settings.bachs_pro_product_id
    return None


def tier_for_product(product_id: str) -> PlanTier | None:
    if not product_id:
        return None
    products = {
        settings.bachs_pro_product_id: PlanTier.Pro,
        settings.bachs_pro_trial_product_id: PlanTier.Pro,
    }
    return products.get(product_id)

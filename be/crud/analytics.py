import uuid
from datetime import datetime
from typing import Optional, List, Tuple, Any
from sqlalchemy import func, and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from models.base import Click, Link
from schemas.analyticsSchema import (
    CountryBreakdown,
    CityBreakdown,
    DeviceBreakdown,
    BrowserBreakdown,
    OsBreakdown,
    RefererBreakdown,
    UtmSourceBreakdown,
    UtmMediumBreakdown,
    UtmCampaignBreakdown,
)


class AnalyticsFilters:
    def __init__(
        self,
        project_id: uuid.UUID,
        start_at: datetime,
        end_at: datetime,
        link_id: Optional[uuid.UUID] = None,
        country: Optional[str] = None,
        city: Optional[str] = None,
        device: Optional[str] = None,
        browser: Optional[str] = None,
        os: Optional[str] = None,
        referer: Optional[str] = None,
        utm_source: Optional[str] = None,
        utm_medium: Optional[str] = None,
        utm_campaign: Optional[str] = None,
    ):
        self.project_id = project_id
        self.start_at = start_at
        self.end_at = end_at
        self.link_id = link_id
        self.country = country
        self.city = city
        self.device = device
        self.browser = browser
        self.os = os
        self.referer = referer
        self.utm_source = utm_source
        self.utm_medium = utm_medium
        self.utm_campaign = utm_campaign


def _where_clauses(f: AnalyticsFilters) -> List[Any]:
    clauses: List[Any] = [
        Link.project_id == f.project_id,
        Click.created_at >= f.start_at,
        Click.created_at < f.end_at,
    ]
    if f.link_id is not None:
        clauses.append(Click.link_id == f.link_id)
    if f.country:
        clauses.append(Click.country_code == f.country)
    if f.city:
        clauses.append(Click.city == f.city)
    if f.device:
        clauses.append(Click.device == f.device)
    if f.browser:
        clauses.append(Click.browser == f.browser)
    if f.os:
        clauses.append(Click.os == f.os)
    if f.referer:
        clauses.append(Click.referer == f.referer)
    if f.utm_source:
        clauses.append(Click.utm_source == f.utm_source)
    if f.utm_medium:
        clauses.append(Click.utm_medium == f.utm_medium)
    if f.utm_campaign:
        clauses.append(Click.utm_campaign == f.utm_campaign)
    return clauses


def _base_select(*cols):
    return select(*cols).select_from(Click).join(Link, Link.id == Click.link_id)


async def get_count(db: AsyncSession, f: AnalyticsFilters) -> int:
    stmt = _base_select(func.count(Click.id)).where(and_(*_where_clauses(f)))
    result = await db.execute(stmt)
    return result.scalar_one() or 0


async def get_timeseries_raw(
    db: AsyncSession, f: AnalyticsFilters
) -> List[datetime]:
    stmt = (
        _base_select(Click.created_at)
        .where(and_(*_where_clauses(f)))
        .order_by(Click.created_at.asc())
    )
    result = await db.execute(stmt)
    return [row[0] for row in result.all()]


async def get_countries(
    db: AsyncSession, f: AnalyticsFilters
) -> List[CountryBreakdown]:
    stmt = (
        _base_select(
            Click.country,
            Click.country_code,
            func.count(Click.id).label("clicks"),
        )
        .where(and_(*_where_clauses(f)))
        .group_by(Click.country, Click.country_code)
        .order_by(func.count(Click.id).desc())
    )
    result = await db.execute(stmt)
    return [
        CountryBreakdown(country=row[0], country_code=row[1], clicks=row[2])
        for row in result.all()
    ]


async def get_cities(db: AsyncSession, f: AnalyticsFilters) -> List[CityBreakdown]:
    stmt = (
        _base_select(
            Click.city,
            Click.country_code,
            func.count(Click.id).label("clicks"),
        )
        .where(and_(*_where_clauses(f)))
        .group_by(Click.city, Click.country_code)
        .order_by(func.count(Click.id).desc())
    )
    result = await db.execute(stmt)
    return [
        CityBreakdown(city=row[0], country_code=row[1], clicks=row[2])
        for row in result.all()
    ]


async def _get_single_dim(
    db: AsyncSession, f: AnalyticsFilters, column
) -> List[Tuple[str, int]]:
    stmt = (
        _base_select(column, func.count(Click.id).label("clicks"))
        .where(and_(*_where_clauses(f)))
        .group_by(column)
        .order_by(func.count(Click.id).desc())
    )
    result = await db.execute(stmt)
    return [(row[0], row[1]) for row in result.all()]


async def get_devices(
    db: AsyncSession, f: AnalyticsFilters
) -> List[DeviceBreakdown]:
    rows = await _get_single_dim(db, f, Click.device)
    return [DeviceBreakdown(device=name, clicks=clicks) for name, clicks in rows]


async def get_browsers(
    db: AsyncSession, f: AnalyticsFilters
) -> List[BrowserBreakdown]:
    rows = await _get_single_dim(db, f, Click.browser)
    return [BrowserBreakdown(browser=name, clicks=clicks) for name, clicks in rows]


async def get_oses(db: AsyncSession, f: AnalyticsFilters) -> List[OsBreakdown]:
    rows = await _get_single_dim(db, f, Click.os)
    return [OsBreakdown(os=name, clicks=clicks) for name, clicks in rows]


async def get_referers(
    db: AsyncSession, f: AnalyticsFilters
) -> List[RefererBreakdown]:
    rows = await _get_single_dim(db, f, Click.referer)
    return [RefererBreakdown(referer=name, clicks=clicks) for name, clicks in rows]


async def _get_utm_breakdown(
    db: AsyncSession, f: AnalyticsFilters, column
) -> List[Tuple[str, int]]:
    stmt = (
        _base_select(column, func.count(Click.id).label("clicks"))
        .where(and_(*_where_clauses(f), column.isnot(None)))
        .group_by(column)
        .order_by(func.count(Click.id).desc())
    )
    result = await db.execute(stmt)
    return [(row[0], row[1]) for row in result.all()]


async def get_utm_sources(
    db: AsyncSession, f: AnalyticsFilters
) -> List[UtmSourceBreakdown]:
    rows = await _get_utm_breakdown(db, f, Click.utm_source)
    return [UtmSourceBreakdown(utm_source=name, clicks=clicks) for name, clicks in rows]


async def get_utm_mediums(
    db: AsyncSession, f: AnalyticsFilters
) -> List[UtmMediumBreakdown]:
    rows = await _get_utm_breakdown(db, f, Click.utm_medium)
    return [UtmMediumBreakdown(utm_medium=name, clicks=clicks) for name, clicks in rows]


async def get_utm_campaigns(
    db: AsyncSession, f: AnalyticsFilters
) -> List[UtmCampaignBreakdown]:
    rows = await _get_utm_breakdown(db, f, Click.utm_campaign)
    return [
        UtmCampaignBreakdown(utm_campaign=name, clicks=clicks) for name, clicks in rows
    ]


async def get_earliest_click(
    db: AsyncSession, project_id: uuid.UUID, link_id: Optional[uuid.UUID]
) -> Optional[datetime]:
    stmt = _base_select(func.min(Click.created_at)).where(
        Link.project_id == project_id
    )
    if link_id is not None:
        stmt = stmt.where(Click.link_id == link_id)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def link_belongs_to_project(
    db: AsyncSession, link_id: uuid.UUID, project_id: uuid.UUID
) -> bool:
    stmt = select(Link.id).where(Link.id == link_id, Link.project_id == project_id)
    result = await db.execute(stmt)
    return result.scalar_one_or_none() is not None

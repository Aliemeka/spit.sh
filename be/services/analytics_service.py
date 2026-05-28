import uuid
from datetime import datetime, timedelta, timezone
from typing import Optional, List, Tuple, Union
from sqlalchemy.ext.asyncio import AsyncSession

from schemas.analyticsSchema import (
    Interval,
    GroupBy,
    CountResponse,
    TimeseriesBucket,
)
from crud import analytics as analytics_crud


_INTERVAL_TO_DELTA = {
    Interval.h24: timedelta(hours=24),
    Interval.d7: timedelta(days=7),
    Interval.d30: timedelta(days=30),
    Interval.d90: timedelta(days=90),
}


async def resolve_time_range(
    interval: Interval,
    db: AsyncSession,
    project_id: uuid.UUID,
    link_id: Optional[uuid.UUID],
) -> Tuple[datetime, datetime, str]:
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    if interval == Interval.all_:
        earliest = await analytics_crud.get_earliest_click(db, project_id, link_id)
        start = earliest or now
        return start, now, "day"
    delta = _INTERVAL_TO_DELTA[interval]
    start = now - delta
    granularity = "hour" if interval == Interval.h24 else "day"
    return start, now, granularity


def _bucket_key(ts: datetime, granularity: str) -> datetime:
    if granularity == "hour":
        return ts.replace(minute=0, second=0, microsecond=0)
    return ts.replace(hour=0, minute=0, second=0, microsecond=0)


def _generate_buckets(
    start: datetime, end: datetime, granularity: str
) -> List[datetime]:
    step = timedelta(hours=1) if granularity == "hour" else timedelta(days=1)
    first = _bucket_key(start, granularity)
    buckets: List[datetime] = []
    cur = first
    while cur < end:
        buckets.append(cur)
        cur += step
    return buckets


def _bucket_timeseries(
    timestamps: List[datetime],
    start: datetime,
    end: datetime,
    granularity: str,
) -> List[TimeseriesBucket]:
    buckets = _generate_buckets(start, end, granularity)
    counts = {b: 0 for b in buckets}
    for ts in timestamps:
        key = _bucket_key(ts, granularity)
        if key in counts:
            counts[key] += 1
    return [TimeseriesBucket(start=b, clicks=counts[b]) for b in buckets]


async def get_analytics(
    db: AsyncSession,
    project_id: uuid.UUID,
    group_by: GroupBy,
    interval: Interval,
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
) -> Union[CountResponse, list]:
    start, end, granularity = await resolve_time_range(
        interval, db, project_id, link_id
    )
    filters = analytics_crud.AnalyticsFilters(
        project_id=project_id,
        start_at=start,
        end_at=end,
        link_id=link_id,
        country=country,
        city=city,
        device=device,
        browser=browser,
        os=os,
        referer=referer,
        utm_source=utm_source,
        utm_medium=utm_medium,
        utm_campaign=utm_campaign,
    )

    if group_by == GroupBy.count:
        clicks = await analytics_crud.get_count(db, filters)
        return CountResponse(clicks=clicks)

    if group_by == GroupBy.timeseries:
        timestamps = await analytics_crud.get_timeseries_raw(db, filters)
        return _bucket_timeseries(timestamps, start, end, granularity)

    dispatch = {
        GroupBy.countries: analytics_crud.get_countries,
        GroupBy.cities: analytics_crud.get_cities,
        GroupBy.devices: analytics_crud.get_devices,
        GroupBy.browsers: analytics_crud.get_browsers,
        GroupBy.os: analytics_crud.get_oses,
        GroupBy.referers: analytics_crud.get_referers,
        GroupBy.utm_sources: analytics_crud.get_utm_sources,
        GroupBy.utm_mediums: analytics_crud.get_utm_mediums,
        GroupBy.utm_campaigns: analytics_crud.get_utm_campaigns,
        GroupBy.top_links: analytics_crud.get_top_links,
    }
    return await dispatch[group_by](db, filters)

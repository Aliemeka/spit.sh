from datetime import datetime
from enum import Enum
from typing import Optional, List, Union
from pydantic import BaseModel


class Interval(str, Enum):
    h24 = "24h"
    d7 = "7d"
    d30 = "30d"
    d90 = "90d"
    all_ = "all"


class GroupBy(str, Enum):
    count = "count"
    timeseries = "timeseries"
    countries = "countries"
    cities = "cities"
    devices = "devices"
    browsers = "browsers"
    os = "os"
    referers = "referers"
    utm_sources = "utm_sources"
    utm_mediums = "utm_mediums"
    utm_campaigns = "utm_campaigns"


class Device(str, Enum):
    desktop = "desktop"
    mobile = "mobile"
    tablet = "tablet"
    unknown = "unknown"


class CountResponse(BaseModel):
    clicks: int


class TimeseriesBucket(BaseModel):
    start: datetime
    clicks: int


class CountryBreakdown(BaseModel):
    country: str
    country_code: str
    clicks: int


class CityBreakdown(BaseModel):
    city: str
    country_code: str
    clicks: int


class DeviceBreakdown(BaseModel):
    device: str
    clicks: int


class BrowserBreakdown(BaseModel):
    browser: str
    clicks: int


class OsBreakdown(BaseModel):
    os: str
    clicks: int


class RefererBreakdown(BaseModel):
    referer: str
    clicks: int


class UtmSourceBreakdown(BaseModel):
    utm_source: str
    clicks: int


class UtmMediumBreakdown(BaseModel):
    utm_medium: str
    clicks: int


class UtmCampaignBreakdown(BaseModel):
    utm_campaign: str
    clicks: int


AnalyticsResponse = Union[
    CountResponse,
    List[TimeseriesBucket],
    List[CountryBreakdown],
    List[CityBreakdown],
    List[DeviceBreakdown],
    List[BrowserBreakdown],
    List[OsBreakdown],
    List[RefererBreakdown],
    List[UtmSourceBreakdown],
    List[UtmMediumBreakdown],
    List[UtmCampaignBreakdown],
]

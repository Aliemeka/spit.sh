from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime


class ClickBase(BaseModel):
    ip_address: str
    country: str
    city: str
    country_code: str


class ClickCreate(ClickBase):
    link_id: str
    device: str = "unknown"
    browser: str = "unknown"
    os: str = "unknown"
    referer: str = "(direct)"
    utm_source: Optional[str] = None
    utm_medium: Optional[str] = None
    utm_campaign: Optional[str] = None
    utm_term: Optional[str] = None
    utm_content: Optional[str] = None


class ClickReponse(ClickCreate):
    id: UUID


class ClickCountResponse(BaseModel):
    click_count: int
    created_at: datetime

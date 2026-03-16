from uuid import UUID
from datetime import datetime
from typing import List

from sqlmodel import SQLModel
from pydantic import BaseModel


class LinkBase(BaseModel):
    url: str


class LinkCreate(LinkBase):
    slug: str | None = None
    project_id: UUID | None = None
    tags: List[str] = []
    utm_source: str | None = None
    utm_medium: str | None = None
    utm_campaign: str | None = None
    utm_term: str | None = None
    utm_content: str | None = None


class LinkUpdate(BaseModel):
    url: str | None = None
    slug: str | None = None
    tags: List[str] | None = None
    utm_source: str | None = None
    utm_medium: str | None = None
    utm_campaign: str | None = None
    utm_term: str | None = None
    utm_content: str | None = None


class LinkData(LinkBase):
    slug: str
    shortenUrl: str


class LinkResponse(LinkData):
    id: UUID
    tags: List[str] = []
    utm_source: str | None = None
    utm_medium: str | None = None
    utm_campaign: str | None = None
    utm_term: str | None = None
    utm_content: str | None = None
    click_count: int = 0
    created_at: datetime


class ProjectLinks(BaseModel):
    project_id: UUID
    links: List[LinkResponse]


class LinkInfo(LinkData):
    clicks: int


class ClickBase(SQLModel):
    ip_address: str


class ClickCreate(ClickBase):
    pass


class ClickInfo(ClickBase):
    country: str
    city: str
    country_code: str

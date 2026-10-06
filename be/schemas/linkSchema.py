from uuid import UUID
from datetime import datetime

from sqlmodel import SQLModel
from pydantic import BaseModel, ConfigDict, Field


class LinkBase(BaseModel):
    url: str


class LinkFields(LinkBase):
    project_id: UUID | None = None
    tags: list[str] = Field(default_factory=list)
    utm_source: str | None = None
    utm_medium: str | None = None
    utm_campaign: str | None = None
    utm_term: str | None = None
    utm_content: str | None = None


class LinkCreate(LinkFields):
    slug: str


class LinkPayload(LinkFields):
    slug: str | None = None


class LinkUpdate(BaseModel):
    url: str | None = None
    slug: str | None = None
    tags: list[str] | None = None
    utm_source: str | None = None
    utm_medium: str | None = None
    utm_campaign: str | None = None
    utm_term: str | None = None
    utm_content: str | None = None


class LinkData(LinkBase):
    model_config = ConfigDict(from_attributes=True)

    slug: str
    shortenUrl: str


class LinkResponse(LinkData):
    id: UUID
    tags: list[str] = []
    utm_source: str | None = None
    utm_medium: str | None = None
    utm_campaign: str | None = None
    utm_term: str | None = None
    utm_content: str | None = None
    click_count: int = 0
    created_at: datetime


class ProjectLinks(BaseModel):
    project_id: UUID
    links: list[LinkResponse]


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

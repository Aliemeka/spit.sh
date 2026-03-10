from uuid import UUID

from sqlmodel import SQLModel
from pydantic import BaseModel
from tomlkit import datetime


class LinkBase(BaseModel):
    url: str


class LinkCreate(LinkBase):
    slug: str | None


class LinkData(LinkBase):
    slug: str
    shortenUrl: str


class LinkInfo(LinkData):
    clicks: int


class LinkResponse(LinkInfo):
    id: UUID

    project_id: UUID | None
    created_at: datetime
    last_edited: datetime


class ClickBase(SQLModel):
    ip_address: str


class ClickCreate(ClickBase):
    pass


class ClickInfo(ClickBase):
    country: str
    city: str
    country_code: str

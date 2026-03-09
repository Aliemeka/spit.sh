from sqlmodel import SQLModel
from pydantic import BaseModel
from typing import Optional
from uuid import UUID


class LinkBase(BaseModel):
    url: str


class LinkCreate(LinkBase):
    slug: str | None


class LinkData(LinkBase):
    slug: str
    shortenUrl: str


class LinkResponse(LinkData, table=True):
    id: UUID


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

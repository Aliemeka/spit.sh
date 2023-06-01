from sqlmodel import SQLModel
from typing import Optional


class LinkBase(SQLModel):
    url: str


class LinkCreate(LinkBase):
    slug: Optional[str] = None


class LinkData(LinkBase):
    slug: str
    shortenUrl: str


class ClickBase(SQLModel):
    ip_address: str


class ClickCreate(ClickBase):
    pass


class ClickInfo(ClickBase):
    country: str
    city: str
    country_code: str

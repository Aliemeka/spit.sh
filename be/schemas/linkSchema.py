from sqlmodel import SQLModel
from pydantic import BaseModel

class LinkBase(BaseModel):
    url: str


class LinkCreate(LinkBase):
    slug: str | None


class LinkData(LinkBase):
    slug: str
    shortenUrl: str


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

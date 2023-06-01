from typing import Optional


class LinkBase:
    url: str


class LinkCreate(LinkBase):
    slug: Optional[str]


class LinkData(LinkBase):
    slug: str
    shortenUrl: str


class ClickBase:
    ip_address: str


class ClickCreate(ClickBase):
    pass


class ClickInfo(ClickBase):
    country: str
    city: str
    country_code: str

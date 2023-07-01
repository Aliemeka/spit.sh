from pydantic import BaseModel


class ClickBase(BaseModel):
    ip_address: str
    country: str
    city: str
    country_code: str


class ClickCreate(ClickBase):
    link_id: str

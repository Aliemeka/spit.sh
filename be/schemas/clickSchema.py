from pydantic import BaseModel
from uuid import UUID


class ClickBase(BaseModel):
    ip_address: str
    country: str
    city: str
    country_code: str


class ClickCreate(ClickBase):
    link_id: str


class ClickReponse(ClickCreate):
    id: UUID

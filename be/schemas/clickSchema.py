from pydantic import BaseModel
from uuid import UUID
from datetime import datetime


class ClickBase(BaseModel):
    ip_address: str
    country: str
    city: str
    country_code: str


class ClickCreate(ClickBase):
    link_id: str


class ClickReponse(ClickCreate):
    id: UUID


class ClickCountResponse(BaseModel):
    click_count: int
    created_at: datetime

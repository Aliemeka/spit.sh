from pydantic import BaseModel
import uuid
from datetime import datetime


class UserBase(BaseModel):
    email: str


class UserCreate(UserBase):
    username: str | None


class UserDetials(UserCreate):
    id: uuid.UUID
    first_name: str | None
    last_name: str | None
    joined_at: datetime

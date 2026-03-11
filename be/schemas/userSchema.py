from pydantic import BaseModel, Field
import uuid
from datetime import datetime
from typing import Optional


class UserBase(BaseModel):
    email: str


class UserCreate(UserBase):
    username: str | None


class UserDetials(UserCreate):
    id: uuid.UUID
    first_name: str | None
    last_name: str | None
    joined_at: datetime


class UpdateProfileRequest(BaseModel):
    first_name: str = Field(..., max_length=20)
    last_name: str = Field(..., max_length=25)
    image: Optional[str] = None


class UserProfileResponse(BaseModel):
    id: uuid.UUID
    email: str
    username: Optional[str]
    first_name: Optional[str]
    last_name: Optional[str]
    image: Optional[str]
    joined_at: datetime

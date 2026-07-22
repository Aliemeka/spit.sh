from pydantic import BaseModel, Field, ConfigDict
import uuid
from datetime import datetime
from typing import Optional


class UserBase(BaseModel):
    email: str


class UserCreate(UserBase):
    username: str | None = None


class UserDetials(UserCreate):
    id: uuid.UUID
    first_name: str | None = None
    last_name: str | None = None
    joined_at: datetime


class UpdateProfileRequest(BaseModel):
    first_name: str = Field(..., max_length=20)
    last_name: str = Field(..., max_length=25)
    image: Optional[str] = None


class UserProfileResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    email: str
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    image: Optional[str] = None
    joined_at: datetime

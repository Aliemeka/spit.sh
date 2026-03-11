from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid


class ProjectCreate(BaseModel):
    name: str = Field(..., max_length=20)
    slug: str = Field(..., max_length=30, regex=r"^[a-z0-9-]+$")
    logo: Optional[str] = None


class ProjectResponse(BaseModel):
    id: uuid.UUID
    name: str
    slug: str
    logo: Optional[str]
    created_at: datetime
    links_count: int = 0

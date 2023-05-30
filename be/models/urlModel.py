import datetime
from typing import List, Optional
from sqlmodel import Field, SQLModel, Relationship
import uuid


class URLData(SQLModel, table=True):
    id: str = Field(default=uuid.uuid4, primary_key=True, index=True)
    url: str
    slug: str
    shortenUrl: str
    created_at: datetime = Field(default=datetime.utcnow(), nullable=False)
    last_edited: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    # Relationships
    clicks: List["ClickModal"] = Relationship(back_populates="urlData")


class ClickModal(SQLModel, table=True):
    id: str = Field(default=uuid.uuid4, primary_key=True, index=True)
    ip_address: str
    country: str
    city: str
    country_code: str
    created_at: datetime = Field(default=datetime.utcnow(), nullable=False)

    # Relationships
    url_id: Optional[int] = Field(default=None, foreign_key="urlData.id")

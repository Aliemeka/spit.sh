from datetime import datetime
from typing import List, Optional
from sqlmodel import Field, Relationship, SQLModel
import uuid

from schemas.linkSchema import ClickInfo
from schemas.linkSchema import LinkBase


class Link(LinkBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    slug: str = Field(unique=True)
    shortenUrl: str
    created_at: datetime = Field(default=datetime.utcnow(), nullable=False)
    last_edited: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    # Relationships
    clicks: List["ClickModal"] = Relationship(back_populates="link")
    # project_id: Optional[uuid.UUID] = Field(default=None, foreign_key="project.id")


class ClickModal(ClickInfo, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    ip_address: str
    country: str
    city: str
    country_code: str
    created_at: datetime = Field(default=datetime.utcnow(), nullable=False)

    # Relationships
    link_id: Optional[uuid.UUID] = Field(default=None, foreign_key="link.id")
    link: Optional[Link] = Relationship(back_populates="clicks")

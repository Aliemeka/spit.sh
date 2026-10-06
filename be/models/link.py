from datetime import datetime
import uuid
from typing import TYPE_CHECKING, Optional
import sqlalchemy as sa
from sqlmodel import Field, SQLModel, Relationship

from schemas.linkSchema import ClickInfo, LinkBase

if TYPE_CHECKING:
    from models.project import Project


class Link(LinkBase, SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    slug: str = Field(unique=True)
    shortenUrl: str
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    last_edited: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    utm_source: str | None = Field(default=None, nullable=True)
    utm_medium: str | None = Field(default=None, nullable=True)
    utm_campaign: str | None = Field(default=None, nullable=True)
    utm_term: str | None = Field(default=None, nullable=True)
    utm_content: str | None = Field(default=None, nullable=True)

    clicks: list["Click"] = Relationship(back_populates="link")
    tags: list["LinkTag"] = Relationship(back_populates="link")
    project_id: uuid.UUID | None = Field(default=None, foreign_key="project.id")
    project: Optional["Project"] = Relationship(back_populates="links")


class LinkTag(SQLModel, table=True):
    link_id: uuid.UUID = Field(foreign_key="link.id", primary_key=True)
    tag: str = Field(primary_key=True)

    link: Link | None = Relationship(back_populates="tags")


class Click(ClickInfo, table=True):
    __table_args__ = (
        sa.Index("ix_click_link_created", "link_id", "created_at"),
        sa.Index("ix_click_country", "country_code", "created_at"),
        sa.Index("ix_click_device", "device", "created_at"),
        sa.Index("ix_click_referer", "referer", "created_at"),
    )

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    ip_address: str
    country: str
    city: str
    country_code: str
    device: str = Field(default="unknown")
    browser: str = Field(default="unknown", max_length=64)
    os: str = Field(default="unknown", max_length=64)
    referer: str = Field(default="(direct)", max_length=255)

    utm_source: str | None = Field(default=None, nullable=True, max_length=255)
    utm_medium: str | None = Field(default=None, nullable=True, max_length=255)
    utm_campaign: str | None = Field(default=None, nullable=True, max_length=255)
    utm_term: str | None = Field(default=None, nullable=True, max_length=255)
    utm_content: str | None = Field(default=None, nullable=True, max_length=255)

    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    link_id: uuid.UUID | None = Field(default=None, foreign_key="link.id")
    link: Link | None = Relationship(back_populates="clicks")

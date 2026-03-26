from datetime import datetime, timezone
import enum
from typing import Optional, List
from sqlmodel import Field, SQLModel, Relationship
import uuid
from schemas.linkSchema import ClickInfo
from schemas.linkSchema import LinkBase


class ProjectRole(enum.Enum):
    Onwer = "Onwer"
    Member = "Member"


class ProjectUsers(SQLModel, table=True):
    role: ProjectRole = ProjectRole.Member
    joined_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc), nullable=False
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc), nullable=False
    )

    project_id: uuid.UUID = Field(foreign_key="project.id", primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id", primary_key=True)


class User(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    email: str = Field(unique=True)
    username: Optional[str] = Field(nullable=True, unique=True)
    joined_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc), nullable=False
    )

    first_name: Optional[str] = Field(nullable=True, max_length=20)
    last_name: Optional[str] = Field(nullable=True, max_length=25)
    image: Optional[str] = Field(default=None, nullable=True)

    projects: List["Project"] = Relationship(
        back_populates="users", link_model=ProjectUsers
    )


class Project(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    name: str = Field(max_length=20)
    slug: str = Field(unique=True, index=True)
    logo: Optional[str] = Field(default=None)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc), nullable=False
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc), nullable=False
    )

    links: List["Link"] = Relationship(back_populates="project")
    users: List[User] = Relationship(back_populates="projects", link_model=ProjectUsers)


class Link(LinkBase, SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    slug: str = Field(unique=True)
    shortenUrl: str
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc), nullable=False
    )
    last_edited: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc), nullable=False
    )

    utm_source: Optional[str] = Field(default=None, nullable=True)
    utm_medium: Optional[str] = Field(default=None, nullable=True)
    utm_campaign: Optional[str] = Field(default=None, nullable=True)
    utm_term: Optional[str] = Field(default=None, nullable=True)
    utm_content: Optional[str] = Field(default=None, nullable=True)

    clicks: List["Click"] = Relationship(back_populates="link")
    tags: List["LinkTag"] = Relationship(back_populates="link")
    project_id: Optional[uuid.UUID] = Field(default=None, foreign_key="project.id")
    project: Optional[Project] = Relationship(back_populates="links")


class LinkTag(SQLModel, table=True):
    link_id: uuid.UUID = Field(foreign_key="link.id", primary_key=True)
    tag: str = Field(primary_key=True)

    link: Optional[Link] = Relationship(back_populates="tags")


class Click(ClickInfo, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    ip_address: str
    country: str
    city: str
    country_code: str
    device: str = Field(default="unknown")

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc), nullable=False
    )

    link_id: Optional[uuid.UUID] = Field(default=None, foreign_key="link.id")
    link: Optional[Link] = Relationship(back_populates="clicks")

from datetime import datetime
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
    joined_at: datetime = Field(default=datetime.utcnow(), nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    project_id: uuid.UUID = Field(foreign_key="project.id", primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id", primary_key=True)


class User(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4(), primary_key=True, index=True)
    email: str = Field(unique=True)
    username: Optional[str] = Field(nullable=True, unique=True)
    joined_at: datetime = Field(default=datetime.utcnow(), nullable=False)

    first_name: Optional[str] = Field(nullable=True, max_length=20)
    last_name: Optional[str] = Field(nullable=True, max_length=25)

    #     # Relationships
    projects: List["Project"] = Relationship(
        back_populates="users", link_model=ProjectUsers
    )
    # sessions: List["Session"] = Relationship(back_populates="user")


class Session(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4(), primary_key=True, index=True)
    temp_token: str
    expires: datetime
    hashed_otp: str

    user_id: Optional[uuid.UUID] = Field(foreign_key="user.id")
    # user: User = Relationship(back_populates="sessions")


class Project(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    name: str = Field(max_length=20)
    slug: str = Field(unique=True, index=True)
    logo: Optional[str] = Field(default=None)
    created_at: datetime = Field(default=datetime.utcnow(), nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    links: List["Link"] = Relationship(back_populates="project")

    users: List[User] = Relationship(back_populates="projects", link_model=ProjectUsers)


class Link(LinkBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    slug: str = Field(unique=True)
    shortenUrl: str
    created_at: datetime = Field(default=datetime.utcnow(), nullable=False)
    last_edited: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    # Relationships
    clicks: List["Click"] = Relationship(back_populates="link")
    project_id: Optional[uuid.UUID] = Field(default=None, foreign_key="project.id")
    project: Optional[Project] = Relationship(back_populates="links")


class Click(ClickInfo, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    ip_address: str
    country: str
    city: str
    country_code: str
    created_at: datetime = Field(default=datetime.utcnow(), nullable=False)

    # Relationships
    link_id: Optional[uuid.UUID] = Field(default=None, foreign_key="link.id")
    link: Optional[Link] = Relationship(back_populates="clicks")

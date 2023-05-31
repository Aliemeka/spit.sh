from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
import datetime
import uuid
from .base import User
import enum


class ProjectRole(enum.Enum):
    Onwer = "Onwer"
    Member = "Member"


class Project(SQLModel, table=True):
    id: uuid.UUID = Field(default=uuid.uuid4(), primary_key=True, index=True)
    name: str
    slug: str = Field(unique=True, index=True)
    logo: Optional[str] = Field(default=None)
    created_at: datetime = Field(default=datetime.utcnow(), nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    users: List[User] = Relationship(
        back_populates="projects", link_model="ProjectUsers"
    )


class ProjectUsers(SQLModel, table=True):
    role: ProjectRole = ProjectRole.Member
    joined_at: datetime = Field(default=datetime.utcnow(), nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    project_id: uuid.UUID = Field(foreign_key="project.id", primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id", primary_key=True)

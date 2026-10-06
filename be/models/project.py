from datetime import datetime
import enum
import uuid
from typing import TYPE_CHECKING
from sqlmodel import Field, SQLModel, Relationship

if TYPE_CHECKING:
    from models.link import Link
    from models.user import User


class ProjectRole(enum.Enum):
    Onwer = "Onwer"
    Member = "Member"


class ProjectUsers(SQLModel, table=True):
    role: ProjectRole = ProjectRole.Member
    joined_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    project_id: uuid.UUID = Field(foreign_key="project.id", primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id", primary_key=True)


class Project(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    name: str = Field(max_length=20)
    slug: str = Field(unique=True, index=True)
    logo: str | None = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    links: list["Link"] = Relationship(back_populates="project")
    users: list["User"] = Relationship(
        back_populates="projects", link_model=ProjectUsers
    )


# class Page(SQLModel, table=True):
#     id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
#     name: str
#     slug: str = Field(unique=True)
#     created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
#     updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

#     project_id: Optional[uuid.UUID] = Field(default=None, foreign_key="project.id")
#     project: Optional[Project] = Relationship(back_populates="pages")

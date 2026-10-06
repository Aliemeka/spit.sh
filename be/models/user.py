from datetime import datetime
import uuid
from typing import TYPE_CHECKING
from sqlmodel import Field, SQLModel, Relationship

from models.project import ProjectUsers

if TYPE_CHECKING:
    from models.project import Project


class User(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    email: str = Field(unique=True)
    username: str | None = Field(nullable=True, unique=True)
    joined_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    first_name: str | None = Field(nullable=True, max_length=20)
    last_name: str | None = Field(nullable=True, max_length=25)
    image: str | None = Field(default=None, nullable=True)

    projects: list["Project"] = Relationship(
        back_populates="users", link_model=ProjectUsers
    )

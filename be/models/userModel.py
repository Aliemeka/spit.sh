import datetime
from typing import Optional, List
from sqlmodel import Field, SQLModel, Relationship
import uuid
from .base import Project


class User(SQLModel, table=True):
    id: uuid.UUID = Field(default=uuid.uuid4(), primary_key=True, index=True)
    email: str = Field(unique=True)
    username: Optional[str] = Field(nullable=True, unique=True)
    joined_at: datetime = Field(default=datetime.utcnow(), nullable=False)

    # Relationships
    projects: List[Project] = Relationship(
        back_populates="users", link_model="ProjectUsers"
    )

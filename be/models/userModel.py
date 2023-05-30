import datetime
from typing import Optional
from sqlmodel import Field, SQLModel
import uuid


class User(SQLModel, table=True):
    id: str = Field(default=uuid.uuid4, primary_key=True, index=True)
    email: str = Field(unique=True)
    joined_at: datetime = Field(default=datetime.utcnow(), nullable=False)

    # Relationships

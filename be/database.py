from os import environ
from sqlmodel import SQLModel
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

from pydantic import BaseSettings


class Settings(BaseSettings):
    database_url: str = "sqlite+aiosqlite:///./test_db.db"

    class Config:
        env_file = ".env"


settings = Settings()

DATABASE_URL = settings.database_url


connect_args = {"check_same_thread": False}

engine = create_async_engine(DATABASE_URL, echo=True, connect_args=connect_args)


# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)


async def get_session() -> AsyncSession:
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    async with async_session() as session:
        yield session

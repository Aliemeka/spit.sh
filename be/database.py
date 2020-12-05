from os import environ
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import String, Integer, Column
from sqlalchemy.orm import sessionmaker
from pydantic import BaseSettings

class Settings(BaseSettings):
    database_url: str = "sqlite:///./sql_app.db"

    class Config:
        env_file = ".env"


settings = Settings()

DATABASE_URL = settings.database_url


engine = create_engine(
    DATABASE_URL
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class URLData(Base):
    __tablename__ = "url_data"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String)
    slug = Column(String)
    shortenUrl = Column(String)
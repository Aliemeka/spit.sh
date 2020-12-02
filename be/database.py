from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import String, Integer, Column
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///./sql_app.db"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class URLData(Base):
    __tablename__ = "url_data"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String)
    slug = Column(String)
    shortenUrl = Column(String)
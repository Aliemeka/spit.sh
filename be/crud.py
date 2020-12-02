
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from database import URLData

class URLDataBase(BaseModel):
    url: str

class URLDataCreate(URLDataBase):
    slug: Optional[str] = None

class URLDataSchema(URLDataBase):
    id: int
    slug: str
    shortenUrl: str

    class Config:
        orm_mode = True

def get_urlData(db: Session, slug: str):
    saved_urlData = db.query(URLData).filter(URLData.slug == slug).first()
    return saved_urlData

def save_urlData(db: Session, urlData: URLDataCreate, generated_link):
    saved_url = URLData(url= urlData.url, slug = urlData.slug, shortenUrl = generated_link)
    db.add(saved_url)
    db.commit()
    db.refresh(saved_url)
    return saved_url

    

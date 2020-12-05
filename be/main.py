from fastapi import FastAPI, Depends, HTTPException
from fastapi.responses import RedirectResponse
import random
from string import ascii_letters, digits
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import database
from crud import URLDataCreate, URLDataSchema, get_urlData, save_urlData
from database import SessionLocal, engine

database.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "*",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
async def main():
    return {'message': 'Hello World!'}

@app.get("/get/{id}")
async def find(id: int):
    return {"id": id}

@app.post("/generate", response_model=URLDataSchema)
async def shortenLink(urlData: URLDataCreate, db: Session = Depends(get_db)):
    if urlData.slug:
        db_urlData = get_urlData(db, urlData.slug)

        if db_urlData:
            raise HTTPException(status_code=400, detail="Slug has already been taken") 

    if not urlData.slug:
        urlData.slug = ''.join(random.choices(ascii_letters + digits, k=7))

    generated_link = f'https://spit.sh/{urlData.slug}'
    
    return save_urlData(db, urlData, generated_link)

@app.get('/get-redirect-url/{slug}')
async def getRedirectUrl(slug: str, db: Session = Depends(get_db)):
    db_urlData = get_urlData(db, slug)
    if db_urlData:
        return { 'redirectsTo': db_urlData.url}
    else:
        raise HTTPException(status_code=404, detail="Page not found!")

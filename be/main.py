from fastapi import FastAPI

# import random
from string import ascii_letters, digits
from fastapi.middleware.cors import CORSMiddleware
from database import init_db

app = FastAPI(
    title="Spit.sh API", version="1.1.0", description="API endpoints for Spit.sh"
)

origins = [
    "*",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup():
    await init_db()


@app.get("/")
async def main():
    return {"message": "Hello World!"}


@app.get("/get/{id}")
async def find(id: int):
    return {"id": id}


# @app.post("/generate", response_model=URLDataSchema)
# async def shortenLink(urlData: URLDataCreate, db: Session = Depends(get_db)):
#     if urlData.slug:
#         db_urlData = get_urlData(db, urlData.slug)

#         if db_urlData:
#             raise HTTPException(status_code=400, detail="Slug has already been taken")

#     if not urlData.slug:
#         urlData.slug = ''.join(random.choices(ascii_letters + digits, k=7))

#     generated_link = f'https://spit.sh/{urlData.slug}'

#     return save_urlData(db, urlData, generated_link)

# @app.get('/get-redirect-url/{slug}')
# async def getRedirectUrl(slug: str, db: Session = Depends(get_db)):
#     db_urlData = get_urlData(db, slug)
#     if db_urlData:
#         return { 'redirectsTo': db_urlData.url}
#     else:
#         raise HTTPException(status_code=404, detail="Page not found!")

from fastapi import FastAPI
from fastapi.responses import RedirectResponse
import random
from string import ascii_letters, digits
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

class URLData(BaseModel):
    url: str
    slug: Optional[str] = None

@app.get("/")
async def main():
    return {'message': 'Hello World!'}

@app.get("/get/{id}")
async def find(id: int):
    return {"id": id}

@app.post("/generate")
async def getSlug(urlData: URLData):
    if not urlData.slug:
        urlData.slug = ''.join(random.choices(ascii_letters + digits, k=7))
    generated_link = f'spit.sh/{urlData.slug}'
    return {'longUrl': urlData.url, 'slug': urlData.slug, 'generatedLink': generated_link}

@app.get("/generate/{slug}")
async def getSlug(slug: str):
    return {'slug': slug}



@app.get("/redirect")
async def redirectUrl():
    return RedirectResponse('https://github.com')


@app.post("/generate-url")
async def shorten_url(longUrl: str):
    pass
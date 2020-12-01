from fastapi import FastAPI
from fastapi.responses import RedirectResponse
import random
from string import ascii_letters, digits

app = FastAPI()

@app.get("/")
async def main():
    return {'message': 'Hello World!'}

@app.get("/get/{id}")
async def find(id: int):
    return {"id": id}

@app.get("/generate")
async def getSlug():
    slug = ''.join(random.choices(ascii_letters + digits, k=7))
    return {'slug': slug}

@app.get("/generate/{slug}")
async def getSlug(slug: str):
    return {'slug': slug}



@app.get("/redirect")
async def redirectUrl():
    return RedirectResponse('https://github.com')


@app.post("/generate-url")
async def shorten_url(longUrl: str):
    pass
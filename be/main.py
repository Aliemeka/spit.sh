from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from utils.limiter import limiter

from routers import linkRouter, userRouter, projectRouter

from typing import List

app = FastAPI(
    title="Spit.sh API", version="1.1.0", description="API endpoints for Spit.sh"
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


def configure_routes(routers: List[APIRouter], prefix: str = "/api/v1"):
    for router in routers:
        app.include_router(router, prefix=prefix)


configure_routes([linkRouter.router, userRouter.router, projectRouter.router])

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


@app.get("/")
@limiter.limit("10/minute")
async def main():
    return {"message": "Hello World!"}


@app.get("/get/{id}")
@limiter.limit("10/minute")
async def find(id: int):
    return {"id": id}

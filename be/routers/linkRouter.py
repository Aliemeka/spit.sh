from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession

from schemas.linkSchema import LinkCreate
from schemas.clickSchema import ClickCountResponse
from crud.link import get_link, create_link
from crud.click import get_link_clicks
from utils.generate import generate_slug
from utils.limiter import limiter
from database import get_session
from config.environment import ROOT_DOMAIN
from services.link_service import record_click


router = APIRouter(prefix="/links", tags=["short links"])


@router.post("/", status_code=201)
async def create_new_link(
    payload: LinkCreate, session: AsyncSession = Depends(get_session)
):
    if payload.slug and payload.slug != "":
        exist_link = await get_link(payload.slug, session)
        if exist_link:
            raise HTTPException(status_code=409, detail="Slug already exist")

    if not payload.slug:
        payload.slug = generate_slug()

    short_link = ROOT_DOMAIN + payload.slug

    return await create_link(payload, short_link, session)


@router.get("/{slug}/click-count", response_model=ClickCountResponse)
async def get_click_count(slug: str, session: AsyncSession = Depends(get_session)):
    link = await get_link(slug, session)
    if not link:
        raise HTTPException(status_code=404, detail="Link does not exist")
    clicks = await get_link_clicks(link.id, session)
    return ClickCountResponse(click_count=len(clicks), created_at=link.created_at)


@router.get("/{slug}")
@limiter.limit("30/minute")
async def get_link_by_slug(
    request: Request,
    slug: str,
    background_tasks: BackgroundTasks,
    session: AsyncSession = Depends(get_session),
):
    link = await get_link(slug, session)
    if not link:
        raise HTTPException(status_code=404, detail="Link does not exist")

    background_tasks.add_task(record_click, request.client.host, str(link.id), session)

    return link

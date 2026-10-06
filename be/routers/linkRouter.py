from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession

from schemas.linkSchema import LinkPayload, LinkData
from schemas.clickSchema import ClickCountResponse
from crud.link import get_link
from crud.click import count_link_clicks
from utils.limiter import limiter
from database import get_session
from services.link_service import SlugTakenError, create_public_link, record_click


router = APIRouter(prefix="/links", tags=["short links"])


@router.post("/", status_code=201)
@limiter.limit("5/minute")
async def create_new_link(
    request: Request,
    payload: LinkPayload,
    session: AsyncSession = Depends(get_session),
) -> LinkData:
    try:
        return await create_public_link(payload, session)
    except SlugTakenError:
        raise HTTPException(status_code=409, detail="Slug already exists")


@router.get("/{slug}/click-count", response_model=ClickCountResponse)
@limiter.limit("30/minute")
async def get_click_count(
    request: Request, slug: str, session: AsyncSession = Depends(get_session)
):
    link = await get_link(slug, session)
    if not link:
        raise HTTPException(status_code=404, detail="Link does not exist")
    click_count = await count_link_clicks(link.id, session)
    return ClickCountResponse(click_count=click_count, created_at=link.created_at)


@router.get("/{slug}", response_model=LinkData)
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

    user_agent = request.headers.get("user-agent", "")
    referer = request.headers.get("referer")
    client_ip = (
        request.headers.get("x-forwarded-for", "").split(",")[0].strip()
        or request.headers.get("x-real-ip")
        or request.client.host
    )
    background_tasks.add_task(
        record_click, client_ip, link, user_agent, referer, session
    )

    return LinkData(url=link.url, slug=link.slug, shortenUrl=link.shortenUrl)

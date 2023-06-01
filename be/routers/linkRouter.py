from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession


from schemas.linkSchema import LinkCreate
from models.linkModel import Link
from crud.link import get_link, create_link
from utils.generate import generate_slug
from database import get_session


router = APIRouter(prefix="/links", tags=["short links"])

root_domain = "https://spit.sh/"


@router.post("/", status_code=201)
async def create_new_link(
    payload: LinkCreate, session: AsyncSession = Depends(get_session)
):
    if payload.slug:
        exist_link = await get_link(payload.slug, session)
        if exist_link:
            raise HTTPException(status_code=409, detail="Slug already exist")

    if not payload.slug:
        payload.slug = generate_slug()

    short_link = root_domain + payload.slug

    return await create_link(payload, short_link, session)


@router.get("/{slug}")
async def get_link_by_slug(slug: str, session: AsyncSession = Depends(get_session)):
    link = await get_link(slug, session)
    if not link:
        raise HTTPException(status_code=404, detail="Link does not exist")
    return link

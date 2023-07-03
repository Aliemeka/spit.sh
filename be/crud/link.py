from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession

from schemas.linkSchema import LinkCreate
from models.base import Link


async def get_link(slug: str, db: AsyncSession) -> Link:
    result = await db.execute(select(Link).where(Link.slug == slug))
    link: Link = result.scalars().one_or_none()
    return link


async def create_link(linkData: LinkCreate, short_link: str, db: AsyncSession) -> Link:
    link = Link(url=linkData.url, slug=linkData.slug, shortenUrl=short_link)
    db.add(link)
    await db.commit()
    await db.refresh(link)
    return link

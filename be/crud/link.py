from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession

from schemas.linkSchema import LinkCreate
from models.linkModel import Link


async def get_link(slug: str, session: AsyncSession) -> Link:
    result = await session.execute(select(Link).where(Link.slug == slug))
    link: Link = result.scalars().one_or_none()
    return link


async def create_link(
    linkData: LinkCreate, short_link: str, session: AsyncSession
) -> Link:
    link = Link(url=linkData.url, slug=linkData.slug, shortenUrl=short_link)
    session.add(link)
    await session.commit()
    await session.refresh(link)
    return link

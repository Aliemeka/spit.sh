from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..schemas.linkSchema import LinkData
from ..models.linkModel import Link


async def get_link(slug: str, session: AsyncSession) -> Link:
    result = await session.execute(select(Link).where(Link.slug == slug))
    link: Link = result.scalars().one()
    return link


async def create_link(linkData: LinkData, session: AsyncSession) -> Link:
    link = Link(**linkData)
    session.add(link)
    await session.commit()
    await session.refresh(link)
    return link

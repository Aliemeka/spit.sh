from urllib.parse import urlencode, urlparse, urlunparse, parse_qs
from uuid import UUID
from typing import List

from sqlalchemy import delete, func
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession

from schemas.linkSchema import LinkCreate, LinkData, LinkResponse, LinkUpdate
from models.base import Link, LinkTag, Click


async def get_link(slug: str, db: AsyncSession) -> Link | None:
    result = await db.execute(select(Link).where(Link.slug == slug))
    link: Link = result.scalars().one_or_none()
    if link is None:
        return None
    return link


def _build_utm_url(url: str, data: LinkCreate) -> str:
    utm_params = {
        k: v
        for k, v in {
            "utm_source": data.utm_source,
            "utm_medium": data.utm_medium,
            "utm_campaign": data.utm_campaign,
            "utm_term": data.utm_term,
            "utm_content": data.utm_content,
        }.items()
        if v
    }
    if not utm_params:
        return url
    parsed = urlparse(url)
    existing = parse_qs(parsed.query)
    existing.update({k: [v] for k, v in utm_params.items()})
    new_query = urlencode({k: v[0] for k, v in existing.items()})
    return urlunparse(parsed._replace(query=new_query))


async def create_link(
    linkData: LinkCreate, short_link: str, db: AsyncSession
) -> LinkData:
    link = Link(url=linkData.url, slug=linkData.slug, shortenUrl=short_link)
    db.add(link)
    await db.commit()
    await db.refresh(link)
    return LinkData(url=link.url, slug=link.slug, shortenUrl=link.shortenUrl)


async def create_link_with_user(
    linkData: LinkCreate, short_link: str, project_id: UUID, db: AsyncSession
) -> LinkResponse:
    final_url = _build_utm_url(linkData.url, linkData)
    link = Link(
        url=final_url,
        slug=linkData.slug,
        shortenUrl=short_link,
        project_id=project_id,
        utm_source=linkData.utm_source,
        utm_medium=linkData.utm_medium,
        utm_campaign=linkData.utm_campaign,
        utm_term=linkData.utm_term,
        utm_content=linkData.utm_content,
    )
    db.add(link)
    await db.flush()

    for tag in linkData.tags or []:
        db.add(LinkTag(link_id=link.id, tag=tag))

    await db.commit()
    await db.refresh(link)

    return LinkResponse(
        id=link.id,
        url=link.url,
        slug=link.slug,
        shortenUrl=link.shortenUrl,
        tags=linkData.tags or [],
        utm_source=link.utm_source,
        utm_medium=link.utm_medium,
        utm_campaign=link.utm_campaign,
        utm_term=link.utm_term,
        utm_content=link.utm_content,
        click_count=0,
        created_at=link.created_at,
    )


async def get_project_links(
    project_id: UUID, db: AsyncSession, tag: str | None = None, limit=20, offset=0
) -> List[LinkResponse]:
    stmt = (
        select(Link, func.count(Click.id).label("click_count"))
        .filter(Link.tags.any(tag) if tag else True)
        .outerjoin(Click, Click.link_id == Link.id)
        .where(Link.project_id == project_id)
        .group_by(Link.id)
        .order_by(Link.created_at.desc())
        .limit(limit)
        .offset(offset)
    )
    rows = await db.execute(stmt)
    results = []
    for link, click_count in rows.all():
        tag_rows = await db.execute(
            select(LinkTag.tag).where(LinkTag.link_id == link.id)
        )
        tags = [row[0] for row in tag_rows.all()]
        results.append(
            LinkResponse(
                id=link.id,
                url=link.url,
                slug=link.slug,
                shortenUrl=link.shortenUrl,
                tags=tags,
                utm_source=link.utm_source,
                utm_medium=link.utm_medium,
                utm_campaign=link.utm_campaign,
                utm_term=link.utm_term,
                utm_content=link.utm_content,
                click_count=click_count,
                created_at=link.created_at,
            )
        )
    return results


async def update_link(link_id: UUID, data: LinkUpdate, db: AsyncSession) -> Link | None:
    link = await db.get(Link, link_id)
    if not link:
        return None

    if data.url is not None:
        link.url = data.url
    if data.slug is not None:
        link.slug = data.slug
    if data.utm_source is not None:
        link.utm_source = data.utm_source
    if data.utm_medium is not None:
        link.utm_medium = data.utm_medium
    if data.utm_campaign is not None:
        link.utm_campaign = data.utm_campaign
    if data.utm_term is not None:
        link.utm_term = data.utm_term
    if data.utm_content is not None:
        link.utm_content = data.utm_content

    if data.tags is not None:
        await db.execute(delete(LinkTag).where(LinkTag.link_id == link_id))
        for tag in data.tags:
            db.add(LinkTag(link_id=link_id, tag=tag))

    await db.commit()
    await db.refresh(link)
    return link


async def delete_link(link_id: UUID, db: AsyncSession) -> bool:
    link = await db.get(Link, link_id)
    if not link:
        return False
    await db.execute(delete(LinkTag).where(LinkTag.link_id == link_id))
    await db.delete(link)
    await db.commit()
    return True

import uuid
from sqlalchemy import func
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.base import Click
from schemas.clickSchema import ClickCreate


async def create_click(payload: ClickCreate, db: AsyncSession) -> Click:
    click = Click(
        city=payload.city,
        country=payload.country,
        country_code=payload.country_code,
        link_id=payload.link_id,
        ip_address=payload.ip_address,
        device=payload.device,
        browser=payload.browser,
        os=payload.os,
        referer=payload.referer,
        utm_source=payload.utm_source,
        utm_medium=payload.utm_medium,
        utm_campaign=payload.utm_campaign,
        utm_term=payload.utm_term,
        utm_content=payload.utm_content,
    )
    db.add(click)
    await db.commit()
    await db.refresh(click)
    return click


async def count_link_clicks(link_id: uuid.UUID, db: AsyncSession) -> int:
    result = await db.execute(
        select(func.count(Click.id)).where(Click.link_id == link_id)
    )
    return result.scalar_one()

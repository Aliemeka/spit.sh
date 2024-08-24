import uuid
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from models.base import Click
from ..schemas.clickSchema import ClickCreate


async def create_click(payload: ClickCreate, db: AsyncSession) -> Click:
    click = Click(
        city=payload.city,
        country=payload.city,
        country_code=payload.country_code,
        link_id=payload.link_id,
    )
    db.add(click)
    await db.commit()
    await db.refresh(click)
    return click


async def get_link_clicks(link_id: uuid.UUID, db: AsyncSession) -> Click:
    results = await db.execute(select(Click).where(Click.link_id == link_id))
    clicks: List[Click] = results.all()
    return clicks

import uuid
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from models.base import User


async def find_user_by_id(id: uuid.UUID, session: AsyncSession) -> User:
    return await session.get(User, id)


async def find_user_by_email(email: str, session: AsyncSession) -> User:
    res = await session.execute(select(User).where(User.email == email))
    user = res.scalars().first()
    return user

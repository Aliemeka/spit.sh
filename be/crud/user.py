import uuid
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from models.base import User
from config.authentication import manager


@manager.user_loader()
async def find_user_by_id(id: uuid.UUID, session: AsyncSession) -> User | None:
    return await session.get(User, id)


async def find_user_by_email(email: str, session: AsyncSession) -> User | None:
    await session.flush()
    res = await session.execute(select(User).where(User.email == email))
    user = res.scalars().one_or_none()
    return user


async def create_user(email: str, session: AsyncSession) -> User:
    print("Called!")
    new_user = User(email=email)
    session.add(new_user)
    await session.commit()
    await session.refresh(new_user)
    return new_user

import uuid
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from models.base import User
from config.authentication import manager


@manager.user_loader()
async def find_user_by_id(id: uuid.UUID, db: AsyncSession) -> User | None:
    return await db.get(User, id)


async def find_user_by_email(email: str, db: AsyncSession) -> User | None:
    await db.flush()
    res = await db.execute(select(User).where(User.email == email))
    user = res.scalars().one_or_none()
    return user


async def create_user(email: str, db: AsyncSession) -> User:
    print("Called!")
    new_user = User(email=email)
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user

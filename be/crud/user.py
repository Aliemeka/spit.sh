import uuid
from typing import Optional
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from models.base import User
from schemas.userSchema import UpdateProfileRequest


async def find_user_by_id(id: uuid.UUID, db: AsyncSession) -> User | None:
    return await db.get(User, id)


async def find_user_by_email(email: str, db: AsyncSession) -> User | None:
    await db.flush()
    res = await db.execute(select(User).where(User.email == email))
    user = res.scalars().one_or_none()
    return user


async def create_user(email: str, db: AsyncSession) -> User:
    new_user = User(email=email)
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user


async def update_user(user_id: uuid.UUID, email: str, db: AsyncSession) -> User:
    user = await db.get(User, user_id)
    user.email = email
    await db.commit()
    await db.refresh(user)
    return user


async def update_user_profile(
    user_id: uuid.UUID,
    data: UpdateProfileRequest,
    db: AsyncSession,
) -> Optional[User]:
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().one_or_none()
    if not user:
        return None
    user.first_name = data.first_name
    user.last_name = data.last_name
    if data.image is not None:
        user.image = data.image
    await db.commit()
    await db.refresh(user)
    return user

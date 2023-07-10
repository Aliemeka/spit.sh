from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timedelta
import uuid


from models.base import Session
from utils.auth_handlers import generate_token, hash_otp


async def get_session_by_token(temp_token: str, db: AsyncSession) -> Session:
    sessions = await db.execute(select(Session).where(Session.temp_token == temp_token))
    user_session: Session | None = sessions.scalars().one_or_none()
    return user_session


async def create_session(email: str, otp: str, user_id: uuid.UUID, db: AsyncSession):
    temp_token = generate_token()
    expires = datetime.utcnow() + timedelta(minutes=30)
    hashed_otp = hash_otp(otp)

    session = Session(
        temp_token=temp_token, expires=expires, hashed_otp=hashed_otp, user_id=user_id
    )
    db.add(session)
    await db.commit()
    await db.refresh(session)
    return session

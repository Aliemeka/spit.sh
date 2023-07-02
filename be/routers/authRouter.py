from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_session
from schemas.authSchema import EmailLoginSchema, LoginResponseSchema
from crud.user import find_user_by_email, create_user
from crud.session import get_session_by_token, create_session
from utils.generate import generate_otp
from models.base import User

router = APIRouter(prefix="/auth", tags=["authentication"])


async def get_user(email: str, session: AsyncSession) -> User:
    print("Worked")
    existing_user = await find_user_by_email(email, session)
    if existing_user:
        return existing_user
    return await create_user(email, session)


@router.post("/sign-in", status_code=200)
async def sign_in_user(
    payload: EmailLoginSchema, session: AsyncSession = Depends(get_session)
):
    otp = generate_otp()
    print(otp)
    email = payload.email
    user = await get_user(email, session)
    user_session = await create_session(email, otp, user.id, session)
    return {"temp_token": user_session.temp_token}

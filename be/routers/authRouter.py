from fastapi import APIRouter
from sqlalchemy.ext.asyncio import AsyncSession

from schemas.authSchema import EmailLoginSchema, LoginResponseSchema
from crud.user import find_user_by_email, create_user
from crud.session import get_session_by_token, create_session
from utils.generate import generate_otp
from models.base import User

auth_router = APIRouter(prefix="/auth", tags=["authentication"])


@auth_router.post("/login", status_code=200)
async def sign_in_user(payload: EmailLoginSchema, session: AsyncSession):
    otp = generate_otp()
    print(otp)
    email = payload.email
    user: User
    existing_user = await find_user_by_email(email, session)
    if existing_user:
        user = existing_user
    else:
        user = await create_user(email, session)
    user_session = await create_session(email, otp, user.id, session)
    return LoginResponseSchema(temp_token=user_session.temp_token)

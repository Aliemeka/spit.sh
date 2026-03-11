import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_session
from utils.jwt_auth import get_current_user
from crud.user import find_user_by_id, update_user_profile
from schemas.userSchema import UpdateProfileRequest, UserProfileResponse

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserProfileResponse)
async def get_profile(
    current_user: dict = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    user_id = uuid.UUID(current_user["sub"])
    user = await find_user_by_id(user_id, session)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.patch("/me", response_model=UserProfileResponse)
async def patch_profile(
    payload: UpdateProfileRequest,
    current_user: dict = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    user_id = uuid.UUID(current_user["sub"])
    user = await update_user_profile(user_id, payload, session)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

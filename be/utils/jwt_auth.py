from typing import Any

from jose import jwt, JWTError
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from config.environment import settings

bearer_scheme = HTTPBearer()

BearerCredentials = Depends(bearer_scheme)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = BearerCredentials,
) -> dict[str, Any]:
    token = credentials.credentials
    try:
        payload = jwt.decode(
            token,
            settings.better_auth_secret,
            algorithms=["HS256"],
        )
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

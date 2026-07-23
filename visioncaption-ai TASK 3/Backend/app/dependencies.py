from typing import Optional

from fastapi import Depends, Header
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import UnauthorizedException
from app.core.security import get_subject_from_token
from app.db.database import get_db
from app.models.caption_model import UserRecord
from sqlalchemy import select


async def get_optional_token(authorization: Optional[str] = Header(default=None)) -> Optional[str]:
    if authorization is None or not authorization.startswith("Bearer "):
        return None
    return authorization.split(" ", 1)[1]


async def get_current_user(
    token: Optional[str] = Depends(get_optional_token),
    db: AsyncSession = Depends(get_db),
) -> Optional[UserRecord]:
    if token is None:
        return None

    user_id = get_subject_from_token(token, expected_type="access")
    result = await db.execute(select(UserRecord).where(UserRecord.id == user_id))
    user = result.scalar_one_or_none()
    return user


async def require_current_user(
    token: Optional[str] = Depends(get_optional_token),
    db: AsyncSession = Depends(get_db),
) -> UserRecord:
    if token is None:
        raise UnauthorizedException("Authentication required")

    user_id = get_subject_from_token(token, expected_type="access")
    result = await db.execute(select(UserRecord).where(UserRecord.id == user_id))
    user = result.scalar_one_or_none()

    if user is None:
        raise UnauthorizedException("User not found")

    return user
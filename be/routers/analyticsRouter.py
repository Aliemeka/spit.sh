import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_session
from utils.jwt_auth import get_current_user
from utils.limiter import limiter
from crud.project import get_project_by_slug, is_project_member
from crud import analytics as analytics_crud
from services.analytics_service import get_analytics
from schemas.analyticsSchema import GroupBy, Interval, Device

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/{project_slug}")
@limiter.limit("60/minute")
async def get_project_analytics(
    project_slug: str,
    groupBy: GroupBy = Query(default=GroupBy.count),
    interval: Interval = Query(default=Interval.h24),
    linkId: Optional[uuid.UUID] = Query(default=None),
    country: Optional[str] = Query(default=None, max_length=2, min_length=2),
    city: Optional[str] = Query(default=None),
    device: Optional[Device] = Query(default=None),
    browser: Optional[str] = Query(default=None),
    os: Optional[str] = Query(default=None),
    referer: Optional[str] = Query(default=None),
    utm_source: Optional[str] = Query(default=None),
    utm_medium: Optional[str] = Query(default=None),
    utm_campaign: Optional[str] = Query(default=None),
    current_user: dict = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    user_id = uuid.UUID(current_user["sub"])
    project = await get_project_by_slug(project_slug, session)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if not await is_project_member(project.id, user_id, session):
        raise HTTPException(
            status_code=403, detail="You do not have access to this project"
        )

    if linkId is not None and not await analytics_crud.link_belongs_to_project(
        session, linkId, project.id
    ):
        raise HTTPException(status_code=404, detail="Link not found in project")

    return await get_analytics(
        db=session,
        project_id=project.id,
        group_by=groupBy,
        interval=interval,
        link_id=linkId,
        country=country.upper() if country else None,
        city=city,
        device=device.value if device else None,
        browser=browser,
        os=os,
        referer=referer,
        utm_source=utm_source,
        utm_medium=utm_medium,
        utm_campaign=utm_campaign,
    )

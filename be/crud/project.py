import uuid
from typing import List, Tuple
from sqlalchemy.future import select
from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException

from models.base import Project, ProjectUsers, ProjectRole, Link
from schemas.projectSchema import ProjectCreate


async def create_project(
    data: ProjectCreate,
    user_id: uuid.UUID,
    db: AsyncSession,
) -> Project:
    project = Project(name=data.name, slug=data.slug, logo=data.logo)
    db.add(project)
    try:
        await db.flush()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=409, detail="Slug already taken")
    membership = ProjectUsers(
        project_id=project.id,
        user_id=user_id,
        role=ProjectRole.Onwer,
    )
    db.add(membership)
    await db.commit()
    await db.refresh(project)
    return project


async def get_user_projects(
    user_id: uuid.UUID, db: AsyncSession
) -> List[Tuple[Project, int]]:
    stmt = (
        select(Project, func.count(Link.id).label("links_count"))
        .join(ProjectUsers, ProjectUsers.project_id == Project.id)
        .outerjoin(Link, Link.project_id == Project.id)
        .where(ProjectUsers.user_id == user_id)
        .group_by(Project.id)
    )
    result = await db.execute(stmt)
    return result.all()

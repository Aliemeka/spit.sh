import uuid
from typing import List
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException

from models.base import Project, ProjectUsers, ProjectRole
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


async def get_user_projects(user_id: uuid.UUID, db: AsyncSession) -> List[Project]:
    result = await db.execute(
        select(Project)
        .join(ProjectUsers, ProjectUsers.project_id == Project.id)
        .where(ProjectUsers.user_id == user_id)
    )
    return result.scalars().all()

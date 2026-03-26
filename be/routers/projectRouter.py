import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from database import get_session
from utils.jwt_auth import get_current_user
from utils.generate import generate_slug
from crud.project import (
    create_project,
    get_user_projects,
    get_project_by_slug,
    is_project_member,
)
from crud.link import (
    create_link_with_user,
    get_project_links,
    update_link,
    delete_link,
    get_link,
)
from schemas.projectSchema import ProjectCreate, ProjectResponse
from schemas.linkSchema import LinkCreate, LinkUpdate, LinkResponse, ProjectLinks
from config.environment import ROOT_DOMAIN
from models.base import LinkTag

router = APIRouter(prefix="/projects", tags=["projects"])


async def _get_project_or_403(
    project_slug: str, user_id: uuid.UUID, session: AsyncSession
):
    project = await get_project_by_slug(project_slug, session)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if not await is_project_member(project.id, user_id, session):
        raise HTTPException(
            status_code=403, detail="You do not have access to this project"
        )
    return project


@router.post("/", response_model=ProjectResponse, status_code=201)
async def create_new_project(
    payload: ProjectCreate,
    current_user: dict = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    user_id = uuid.UUID(current_user["sub"])
    return await create_project(payload, user_id, session)


@router.get("/", response_model=List[ProjectResponse])
async def list_projects(
    current_user: dict = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    user_id = uuid.UUID(current_user["sub"])
    rows = await get_user_projects(user_id, session)
    return [ProjectResponse(**row[0].dict(), links_count=row[1]) for row in rows]


@router.post("/{project_slug}/links", response_model=LinkResponse, status_code=201)
async def create_project_link(
    project_slug: str,
    payload: LinkCreate,
    current_user: dict = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    user_id = uuid.UUID(current_user["sub"])
    project = await _get_project_or_403(project_slug, user_id, session)

    if payload.slug and payload.slug != "":
        existing = await get_link(payload.slug, session)
        if existing:
            raise HTTPException(status_code=409, detail="Slug already exists")
    else:
        payload.slug = generate_slug()

    short_link = ROOT_DOMAIN + payload.slug
    return await create_link_with_user(payload, short_link, project.id, session)


@router.get("/{project_slug}/links", response_model=ProjectLinks)
async def list_project_links(
    project_slug: str,
    tag: str | None = Query(default=None, description="Filter links by tag."),
    limit: int = Query(default=20, description="Limit the number of results."),
    offset: int = Query(default=0, description="Offset for pagination."),
    current_user: dict = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    user_id = uuid.UUID(current_user["sub"])
    project = await _get_project_or_403(project_slug, user_id, session)

    links = await get_project_links(project.id, session, tag, limit, offset)
    return ProjectLinks(project_id=project.id, links=links)


@router.patch("/{project_slug}/links/{link_id}", response_model=LinkResponse)
async def update_project_link(
    project_slug: str,
    link_id: uuid.UUID,
    payload: LinkUpdate,
    current_user: dict = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    user_id = uuid.UUID(current_user["sub"])
    await _get_project_or_403(project_slug, user_id, session)

    link = await update_link(link_id, payload, session)
    if not link:
        raise HTTPException(status_code=404, detail="Link not found")

    tag_rows = await session.execute(
        select(LinkTag.tag).where(LinkTag.link_id == link.id)
    )
    tags = [row[0] for row in tag_rows.all()]

    return LinkResponse(
        id=link.id,
        url=link.url,
        slug=link.slug,
        shortenUrl=link.shortenUrl,
        tags=tags,
        utm_source=link.utm_source,
        utm_medium=link.utm_medium,
        utm_campaign=link.utm_campaign,
        utm_term=link.utm_term,
        utm_content=link.utm_content,
        click_count=0,
        created_at=link.created_at,
    )


@router.delete("/{project_slug}/links/{link_id}", status_code=204)
async def delete_project_link(
    project_slug: str,
    link_id: uuid.UUID,
    current_user: dict = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    user_id = uuid.UUID(current_user["sub"])
    await _get_project_or_403(project_slug, user_id, session)

    deleted = await delete_link(link_id, session)
    if not deleted:
        raise HTTPException(status_code=404, detail="Link not found")

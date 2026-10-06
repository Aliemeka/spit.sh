import re
import asyncio
from urllib.parse import urlparse
from uuid import UUID
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from user_agents import parse as parse_ua

from schemas.clickSchema import ClickCreate
from schemas.linkSchema import LinkCreate, LinkData, LinkPayload, LinkResponse
from crud.click import create_click
from crud.link import create_link, create_link_with_user
from models.link import Link
from config.environment import GEOIP_DB_PATH, ROOT_DOMAIN
from utils.generate import generate_slug


class SlugTakenError(Exception):
    pass


def _resolve_slug(payload: LinkPayload) -> tuple[LinkCreate, str]:
    slug = payload.slug or generate_slug()
    data = LinkCreate(**payload.model_dump(exclude={"slug"}), slug=slug)
    return data, ROOT_DOMAIN + slug


async def create_public_link(payload: LinkPayload, session: AsyncSession) -> LinkData:
    data, short_link = _resolve_slug(payload)
    try:
        return await create_link(data, short_link, session)
    except IntegrityError:
        await session.rollback()
        raise SlugTakenError


async def create_link_for_project(
    payload: LinkPayload, project_id: UUID, session: AsyncSession
) -> LinkResponse:
    data, short_link = _resolve_slug(payload)
    try:
        return await create_link_with_user(data, short_link, project_id, session)
    except IntegrityError:
        await session.rollback()
        raise SlugTakenError


def _resolve_geo(ip: str) -> dict:
    try:
        import geoip2.database

        with geoip2.database.Reader(GEOIP_DB_PATH) as reader:
            response = reader.city(ip)
            return {
                "country": response.country.name or "unknown",
                "city": response.city.name or "unknown",
                "country_code": response.country.iso_code or "unknown",
            }
    except Exception:
        return {"country": "unknown", "city": "unknown", "country_code": "unknown"}


def get_device_type(user_agent: str) -> str:
    ua = user_agent.lower()
    if re.search(r"ipad|android(?!.*mobile)|tablet", ua):
        return "tablet"
    elif re.search(r"mobile|android|iphone|ipod|windows phone", ua):
        return "mobile"
    return "desktop"


def parse_browser_os(user_agent: str) -> tuple[str, str]:
    try:
        parsed = parse_ua(user_agent)
        browser = parsed.browser.family or "unknown"
        os = parsed.os.family or "unknown"
        return browser, os
    except Exception:
        return "unknown", "unknown"


def extract_referer_host(referer: str | None) -> str:
    if not referer:
        return "(direct)"
    try:
        host = urlparse(referer).hostname
        return host or "(direct)"
    except Exception:
        return "(direct)"


async def record_click(
    ip: str,
    link: Link,
    user_agent: str,
    referer: str | None,
    session: AsyncSession,
):
    loop = asyncio.get_running_loop()
    geo = await loop.run_in_executor(None, _resolve_geo, ip)
    device = get_device_type(user_agent)
    browser, os_name = parse_browser_os(user_agent)
    referer_host = extract_referer_host(referer)

    click_payload = ClickCreate(
        ip_address=ip,
        country=geo["country"],
        city=geo["city"],
        country_code=geo["country_code"],
        device=device,
        browser=browser,
        os=os_name,
        referer=referer_host,
        link_id=link.id,
        utm_source=link.utm_source,
        utm_medium=link.utm_medium,
        utm_campaign=link.utm_campaign,
        utm_term=link.utm_term,
        utm_content=link.utm_content,
    )
    await create_click(click_payload, session)

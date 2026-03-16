import re
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession

from schemas.clickSchema import ClickCreate
from crud.click import create_click
from config.environment import GEOIP_DB_PATH


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


async def record_click(ip: str, link_id: str, user_agent: str, session: AsyncSession):
    loop = asyncio.get_event_loop()
    geo = await loop.run_in_executor(None, _resolve_geo, ip)
    device = get_device_type(user_agent)
    click_payload = ClickCreate(
        ip_address=ip,
        country=geo["country"],
        city=geo["city"],
        country_code=geo["country_code"],
        device=device,
        link_id=link_id,
    )
    await create_click(click_payload, session)

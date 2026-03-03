import asyncio
from sqlalchemy.ext.asyncio import AsyncSession

from schemas.clickSchema import ClickCreate
from crud.click import create_click


def _resolve_geo(ip: str) -> dict:
    try:
        from ip2geotools.databases.noncommercial import DbIpCity

        response = DbIpCity.get(ip, api_key="free")
        return {
            "country": response.country or "unknown",
            "city": response.city or "unknown",
            "country_code": response.country_short or "unknown",
        }
    except Exception:
        return {"country": "unknown", "city": "unknown", "country_code": "unknown"}


async def record_click(ip: str, link_id: str, session: AsyncSession):
    loop = asyncio.get_event_loop()
    geo = await loop.run_in_executor(None, _resolve_geo, ip)
    click_payload = ClickCreate(
        ip_address=ip,
        country=geo["country"],
        city=geo["city"],
        country_code=geo["country_code"],
        link_id=link_id,
    )
    await create_click(click_payload, session)

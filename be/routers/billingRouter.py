import uuid
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_session
from utils.jwt_auth import get_current_user
from crud.project import get_member_role, get_project_by_slug
from models.project import Project, ProjectRole
from schemas.billingSchema import (
    BillingState,
    CheckoutRequest,
    CheckoutResponse,
    PortalResponse,
)
from services.bachs_client import BachsError, InvalidWebhook
from services.billing_service import (
    NoBillingCustomer,
    NotUnpaid,
    OutstandingPayment,
    SubscriptionExists,
    UnsupportedTier,
    get_billing_state,
    handle_webhook,
    open_portal,
    start_checkout,
    switch_to_free,
)

router = APIRouter(prefix="/projects/{project_slug}/billing", tags=["billing"])
webhook_router = APIRouter(prefix="/billing", tags=["billing"])

def _provider_unavailable() -> HTTPException:
    return HTTPException(
        status_code=502, detail="Payment provider unavailable, try again shortly"
    )


async def _get_project(
    project_slug: str,
    user_id: uuid.UUID,
    session: AsyncSession,
    owner_only: bool = False,
) -> Project:
    project = await get_project_by_slug(project_slug, session)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    role = await get_member_role(project.id, user_id, session)
    if role is None:
        raise HTTPException(
            status_code=403, detail="You do not have access to this project"
        )
    if owner_only and role != ProjectRole.Owner:
        raise HTTPException(
            status_code=403, detail="Only the project owner can manage billing"
        )
    return project


@router.get("", response_model=BillingState)
async def get_billing(
    project_slug: str,
    current_user: dict = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    user_id = uuid.UUID(current_user["sub"])
    project = await _get_project(project_slug, user_id, session)
    return await get_billing_state(project, session)


@router.post("/checkout", response_model=CheckoutResponse)
async def create_checkout(
    project_slug: str,
    payload: CheckoutRequest,
    current_user: dict = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    user_id = uuid.UUID(current_user["sub"])
    project = await _get_project(project_slug, user_id, session, owner_only=True)

    try:
        checkout_url = await start_checkout(project, user_id, payload.tier, session)
    except SubscriptionExists:
        raise HTTPException(status_code=409, detail={"code": "subscription_exists"})
    except OutstandingPayment:
        raise HTTPException(status_code=409, detail={"code": "outstanding_payment"})
    except UnsupportedTier:
        raise HTTPException(status_code=400, detail="This plan can't be purchased")
    except BachsError:
        raise _provider_unavailable()
    return CheckoutResponse(checkout_url=checkout_url)


@router.post("/portal", response_model=PortalResponse)
async def create_portal(
    project_slug: str,
    current_user: dict = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    user_id = uuid.UUID(current_user["sub"])
    await _get_project(project_slug, user_id, session, owner_only=True)

    try:
        portal_url = await open_portal(user_id, session)
    except NoBillingCustomer:
        raise HTTPException(status_code=404, detail="No billing account yet")
    except BachsError:
        raise _provider_unavailable()
    return PortalResponse(portal_url=portal_url)


@router.post("/switch-to-free", response_model=BillingState)
async def downgrade_to_free(
    project_slug: str,
    current_user: dict = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    user_id = uuid.UUID(current_user["sub"])
    project = await _get_project(project_slug, user_id, session, owner_only=True)

    try:
        return await switch_to_free(project, session)
    except NotUnpaid:
        raise HTTPException(status_code=409, detail={"code": "not_unpaid"})
    except BachsError:
        raise _provider_unavailable()


@webhook_router.post("/webhooks/bachs")
async def bachs_webhook(request: Request, session: AsyncSession = Depends(get_session)):
    raw_body = await request.body()
    try:
        await handle_webhook(
            raw_body,
            request.headers.get("X-Bachs-Signature", ""),
            request.headers.get("X-Bachs-Timestamp", ""),
            session,
        )
    except InvalidWebhook:
        raise HTTPException(status_code=400, detail="Invalid webhook")
    return {"received": True}

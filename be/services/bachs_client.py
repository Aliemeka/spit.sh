import logging
from collections.abc import Awaitable, Callable
from typing import Any, TypeVar

import bachs
from bachs import AsyncBachs, webhooks

from config.environment import BACHS_API_KEY, BACHS_WEBHOOK_SECRET
from models.billing import BillingCurrency, SubscriptionStatus

logger = logging.getLogger(__name__)

REQUEST_TIMEOUT_SECONDS = 10.0

T = TypeVar("T")


# Our own exceptions, so services and routers don't depend on the SDK's error types.
class BachsError(Exception):
    pass


class InvalidWebhook(Exception):
    pass


async def _call(action: str, request: Callable[[AsyncBachs], Awaitable[T]]) -> T:
    try:
        async with AsyncBachs(
            api_key=BACHS_API_KEY, timeout=REQUEST_TIMEOUT_SECONDS
        ) as client:
            return await request(client)
    except bachs.BachsApiError as exc:
        logger.error(
            "Bachs %s failed with %s %s: %s (request_id=%s)",
            action,
            exc.status_code,
            exc.error_code,
            exc,
            exc.request_id,
        )
        raise BachsError(f"Bachs {action} failed: {exc}") from exc
    except bachs.BachsError as exc:
        logger.error("Bachs %s failed: %s", action, exc)
        raise BachsError(f"Bachs {action} failed: {exc}") from exc


async def create_checkout_session(
    product_id: str,
    customer: dict[str, str],
    success_url: str,
    cancel_url: str,
    metadata: dict[str, str],
    reference: str,
    billing_currency: BillingCurrency | None = None,
) -> str:
    session = await _call(
        "create checkout session",
        lambda client: client.checkout_sessions.create(
            product_cart=[{"product_id": product_id, "quantity": 1}],
            customer=customer,  # type: ignore[arg-type]
            success_url=success_url,
            cancel_url=cancel_url,
            metadata=metadata,
            reference=reference,
            **(
                {"billing_currency": billing_currency.value}
                if billing_currency is not None
                else {}
            ),
            idempotency_key=f"checkout-{reference}",
        ),
    )
    return session.checkout_url


async def create_portal_session(customer_id: str) -> str:
    session = await _call(
        "create portal session",
        lambda client: client.customer_portal.create_session(customer_id),
    )
    return session.url


async def cancel_subscription(subscription_id: str) -> None:
    await _call(
        "cancel subscription",
        lambda client: client.subscriptions.cancel(
            subscription_id,
            cancel_at_period_end=False,
            idempotency_key=f"cancel-{subscription_id}",
        ),
    )


def verify_webhook(raw_body: bytes, headers: Any) -> dict[str, Any]:
    try:
        event = webhooks.construct_event(raw_body, headers, BACHS_WEBHOOK_SECRET)
    except bachs.BachsError as exc:
        logger.warning("Rejected Bachs webhook: %s", exc)
        raise InvalidWebhook(str(exc)) from exc
    return event.to_dict()


def to_subscription_status(bachs_status: str) -> SubscriptionStatus:
    try:
        return SubscriptionStatus(bachs_status)
    except ValueError:
        logger.warning(
            "Unrecognised Bachs subscription status %r, treating as canceled",
            bachs_status,
        )
        return SubscriptionStatus.Canceled

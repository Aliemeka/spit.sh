import hashlib
import hmac
import json
import logging
import time
from typing import Any
import httpx

from config.environment import BACHS_API_BASE_URL, BACHS_API_KEY, BACHS_WEBHOOK_SECRET
from models.billing import BillingCurrency, SubscriptionStatus

logger = logging.getLogger(__name__)

WEBHOOK_TOLERANCE_SECONDS = 300


class BachsError(Exception):
    pass


class InvalidWebhook(Exception):
    pass


def _client() -> httpx.AsyncClient:
    return httpx.AsyncClient(
        base_url=BACHS_API_BASE_URL,
        headers={"Authorization": f"Bearer {BACHS_API_KEY}"},
        timeout=10.0,
    )


async def _request(method: str, path: str, **kwargs: Any) -> dict[str, Any]:
    try:
        async with _client() as client:
            response = await client.request(method, path, **kwargs)
    except httpx.HTTPError as exc:
        raise BachsError(f"Bachs request failed: {exc}") from exc
    if response.is_error:
        message = f"Bachs {method} {path} returned {response.status_code}: {response.text}"
        logger.error(message)
        raise BachsError(message)
    return response.json()


async def create_checkout_session(
    product_id: str,
    customer: dict[str, str],
    success_url: str,
    cancel_url: str,
    metadata: dict[str, str],
    reference: str,
    billing_currency: BillingCurrency | None = None,
) -> str:
    body = {
        "product_cart": [{"product_id": product_id, "quantity": 1}],
        "customer": customer,
        "success_url": success_url,
        "cancel_url": cancel_url,
        "metadata": metadata,
        "reference": reference,
    }
    if billing_currency:
        body["billing_currency"] = billing_currency.value
    session = await _request("POST", "/v1/checkout-sessions", json=body)
    return session["checkout_url"]


async def create_portal_session(customer_id: str) -> str:
    session = await _request("POST", f"/v1/customers/{customer_id}/portal-sessions")
    return session["url"]


async def cancel_subscription(subscription_id: str) -> None:
    await _request(
        "DELETE",
        f"/v1/subscriptions/{subscription_id}",
        json={"cancel_at_period_end": False},
    )


def verify_webhook(raw_body: bytes, signature: str, timestamp: str) -> dict[str, Any]:
    try:
        sent_at = int(timestamp)
    except (TypeError, ValueError):
        raise InvalidWebhook("Missing or malformed timestamp")
    if abs(time.time() - sent_at) > WEBHOOK_TOLERANCE_SECONDS:
        raise InvalidWebhook("Stale webhook")

    signed = f"{timestamp}.".encode() + raw_body
    expected = hmac.new(
        BACHS_WEBHOOK_SECRET.encode(), signed, hashlib.sha256
    ).hexdigest()
    if not hmac.compare_digest(expected, signature or ""):
        raise InvalidWebhook("Signature mismatch")

    return json.loads(raw_body)


def to_subscription_status(bachs_status: str) -> SubscriptionStatus:
    try:
        return SubscriptionStatus(bachs_status)
    except ValueError:
        logger.warning(
            "Unrecognised Bachs subscription status %r, treating as canceled",
            bachs_status,
        )
        return SubscriptionStatus.Canceled

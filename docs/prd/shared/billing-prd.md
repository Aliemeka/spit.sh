# Billing & Plans PRD

## Overview

spit.sh moves to subscription billing, **billed per project**. Every project is on a plan tier that sets its monthly limits (links, tracked events, seats) and features (custom domains, folders, etc.). Payments are processed by **[Bachs](https://bachs.io)**, which handles card, bank-transfer and mobile-money collection in NGN and USD.

Launch ships two tiers, **Free** and **Pro**. A third tier, **Business**, must be addable later without schema changes: adding it means one enum value, one plan-config entry and one env var.

The project **owner** pays. The owner's user account is the Bachs customer. One owner can pay for several projects, and each project has its own subscription.

---

## Goals

1. Projects on Free are limited to the Free quota; nothing paid leaks through.
2. An owner can upgrade a project to Pro through Bachs hosted checkout, with a 14-day trial the first time.
3. Plan state in our DB always follows Bachs webhooks, with no manual reconciliation.
4. Short-link redirects **never** fail because of billing state.
5. Adding the Business tier later is a config change plus a Bachs product. It needs no new tables.

## Non-goals (this PRD)

- Building custom domains, link folders, CSV export, password and expiry links, or the analytics retention job. This PRD defines the **entitlement keys** that gate them; each feature gets its own PRD.
- Yearly billing. v1 is monthly only; see [Future work](#future-work).
- Usage-based or overage billing. Limits are hard caps.
- Moving a subscription to someone else when project ownership changes.

---

## User Stories

1. As a project owner, I can see my project's current plan, usage this period (links, events, seats) and renewal date.
2. As a project owner, I can upgrade a project to Pro and pay in NGN or USD depending on where I am.
3. As a first-time Pro customer, I get a 14-day free trial before I'm charged.
4. As a project owner, I can manage my card, see invoices and cancel through the Bachs customer portal.
5. As a project member, when I hit a plan limit I see a clear message explaining the limit and how to upgrade.
6. As a visitor clicking a short link, the redirect works no matter what plan the project is on or how far over its limits it is.

---

## Plans

### Tier matrix

| Entitlement key | Free | Pro | Business (later) |
|---|---|---|---|
| `links_per_period` | 30 | 1,000 | TBD (10,000+) |
| `events_per_period` | 5,000 | 50,000 | TBD (500,000+) |
| `seats` | 1 | 10 | TBD (25+) |
| `custom_domains` (max count) | 0 | 3 | TBD |
| `link_folders` | ✗ | ✓ | ✓ |
| `analytics_retention_days` | 30 | 365 | unlimited |
| `password_links` | ✗ | ✓ | ✓ |
| `link_expiry` | ✗ | ✓ | ✓ |
| `csv_export` | ✗ | ✓ | ✓ |
| `bulk_import` | ✗ | ✓ | ✓ |
| `api_rate_limit` | low | higher | highest |
| `priority_support` | ✗ | ✓ | ✓ + SLA |
| `geo_device_targeting` | ✗ | ✗ | ✓ |

The limits and switches live in code (`be/config/plans.py`), not in the database. Bachs only knows prices; we own what each tier allows.

### Pricing

| Tier | USD | NGN |
|---|---|---|
| Free | $0 | ₦0 |
| Pro (monthly) | **TBD** (proposed $15) | **TBD**: set as a Bachs currency option, not an automatic conversion |

### Bachs product setup

| Bachs product | Price | `trial_period` | Env var |
|---|---|---|---|
| Pro (with trial) | USD primary + NGN currency option, monthly | `{ "interval": "day", "frequency": 14 }` | `BACHS_PRO_TRIAL_PRODUCT_ID` |
| Pro | USD primary + NGN currency option, monthly | none | `BACHS_PRO_PRODUCT_ID` |
| Business *(later)* | USD + NGN, monthly | none | `BACHS_BUSINESS_PRODUCT_ID` |

Both Pro products map to `PlanTier.pro`. Two products are needed because Bachs sets trials on the product and cannot limit a trial to once per customer (see [Trials](#trials)).

**Constraint from Bachs:** a plan change (`PATCH /v1/subscriptions/{id}` with a new `product_id`) only works if the target product bills at the same interval **and has a price in the subscription's currency**. Every paid product must therefore have both USD and NGN prices.

---

## Currency

- Each paid product has a **USD primary price** and an **NGN currency option** set to an exact amount.
- Bachs picks the checkout currency from the customer's detected location: NGN for Nigeria, USD everywhere else. We do **not** pass `billing_currency` in production.
- The subscription's currency is fixed when the checkout completes. To switch currency, the owner cancels and subscribes again (rare; handled by support).
- Our billing page shows the price based on the visitor's location: geo lookup gives `NG` → NGN, anything else → USD. This display is a hint only; Bachs checkout decides the actual currency.

---

## Trials

- **14 days**, on the first Pro subscription **per owner**. Making new projects doesn't give extra trials.
- Bachs **needs a payment method** to start a trial. The card is saved but not charged until the trial ends.
- Trial eligibility is tracked on `User.trial_used_at`. At checkout:
  - `trial_used_at IS NULL` → use `BACHS_PRO_TRIAL_PRODUCT_ID`
  - otherwise → use `BACHS_PRO_PRODUCT_ID`
- `trial_used_at` is set when `customer.subscription.created` arrives with `status = trialing`, not when checkout starts. A checkout the owner abandons doesn't use up their trial.
- During the trial the project has full Pro entitlements (status `trialing`).
- If the charge fails when the trial ends, Bachs sends `invoice.payment_failed` and starts payment recovery. We treat this as `past_due` (see [Status → tier](#status--effective-tier)).

---

## Usage Limits & Enforcement

### Usage period

| Plan state | Period |
|---|---|
| Free (no subscription, or subscription fell back to Free) | Calendar month, UTC: 1st 00:00 → next 1st 00:00 |
| Paid (`trialing`, `active`, `past_due`) | Bachs `current_period_start` → `current_period_end` |

When a Free project upgrades in the middle of a month, a new usage period starts at the subscription's `current_period_start`, so usage resets. When a paid project falls back to Free, the calendar-month period applies from then on.

### Counters

Usage is tracked in `ProjectUsage` rows, one per project per period. We never run `COUNT(*)` on `click` or `link` while handling a request.

- **Links:** increment `links_created` when a link is created. Deleting a link does **not** decrement it; otherwise a user could create and delete links forever.
- **Events:** increment `events_tracked` inside the click-recording background task.
- Increments are atomic: `UPDATE project_usage SET x = x + 1 WHERE ...`. The row is upserted the first time it's needed in a period.

### Enforcement rules

| Action | Check | Over limit |
|---|---|---|
| Create link | `links_created < links_per_period` | Reject with `402`, `code: plan_limit_reached` |
| Bulk import *(future)* | `links_created + n <= links_per_period` | Reject the whole batch with `402` |
| Short-link redirect | **none** | Always redirect |
| Record click (background task) | `events_tracked < events_per_period` | **Skip writing the `Click` row** and don't increment the counter |
| Add or invite a member | current members (+ pending invites) `< seats` | `402`, `code: plan_limit_reached` |
| Use a gated feature | `entitlements[feature]` is truthy / under its count | `402`, `code: feature_not_in_plan` |

Events go uncounted while a project is over its event limit. The billing page shows: *"Event tracking paused: limit reached. Clicks still redirect. Upgrade to resume tracking."*

### Usage warnings

`ProjectUsage` records `warned_80_at` and `warned_100_at` per counter. In v1 these show as an **in-app banner** on the project dashboard. Email notifications wait until the backend has an email service.

### Error contract

All plan errors use HTTP `402 Payment Required` so the frontend can catch them in one place:

```json
{
  "detail": {
    "code": "plan_limit_reached",
    "limit": "links_per_period",
    "current": 30,
    "max": 30,
    "tier": "free"
  }
}
```

```json
{
  "detail": {
    "code": "feature_not_in_plan",
    "feature": "custom_domains",
    "tier": "free"
  }
}
```

### Downgrades: lock, never delete

When a project's effective tier drops (cancellation, `unpaid` after payment recovery fails, or a Business → Pro change later):

- **Links:** all stay and keep redirecting. New links are blocked once over the new quota.
- **Members:** everyone over the seat limit stays, but no new members can be added until the count is under the limit.
- **Custom domains:** settings are kept but stop resolving. They come back on upgrade.
- **Folders:** stay visible and read-only; links can't be moved into them.
- **Analytics:** clicks older than the new retention window are hidden from queries straight away. The retention job (in its own PRD) may later hard-delete them.

---

## Subscription Lifecycle

### Status → effective tier

| `status` | Effective tier | Meaning | Owner can |
|---|---|---|---|
| `trialing` | Subscribed tier | In the 14-day trial | Manage billing |
| `active` | Subscribed tier | Paid. Includes `cancel_at_period_end = true` until the period ends | Manage billing |
| `past_due` | Subscribed tier | Renewal failed and Bachs is retrying (3 retries over about 9 days) | Update card in the portal |
| `unpaid` | **Free** | Every retry failed. The subscription is on hold with an outstanding invoice | **Pay now** or **Switch to Free**. Upgrade is blocked |
| `canceled` | Free | Cancelled by the owner, or switched to Free from `unpaid` | Upgrade (new checkout) |
| *(no subscription row)* | Free | Never subscribed | Upgrade |

- **Grace period = Bachs's retry window.** We don't run our own timer. The project keeps its paid tier while Bachs reports `past_due`, and drops to Free when Bachs moves the subscription to `unpaid`.
- `SubscriptionStatus` is our own enum, not Bachs's. The Bachs adapter maps any status it doesn't recognise (e.g. `paused`, which we don't use) to `canceled` and logs a warning, so a new status can't break webhook handling.
- The tier is worked out on every read (`get_plan(project)`), not stored as a separate "effective tier" column.

**Bachs account setting:** after recovery fails, subscriptions must go to **"Mark unpaid"**, not the default "Cancel". Without this setting we never receive `unpaid`.

### Flows

**Upgrade (Free → Pro)**
```
Owner clicks "Upgrade" → POST /billing/checkout → Bachs hosted checkout
  → customer pays / starts trial → redirect to success_url
  → webhook customer.subscription.created → ProjectSubscription upserted → tier = pro
```
The `success_url` page polls `GET /billing` (every 2s, giving up after 30s) until `tier` changes. **The redirect alone never grants Pro.** Only the webhook does.

**Cancel**
Through the Bachs customer portal. Bachs sends `customer.subscription.updated` with `cancel_at_period_end = true`. The project keeps Pro until `current_period_end`, then `customer.subscription.deleted` drops it to Free.

**Failed renewal**
`invoice.payment_failed` → status `past_due`, set `past_due_since` (if it's empty) → "payment failed" banner; the project keeps its paid tier. Bachs retries 3 times over about 9 days. If a retry works: `invoice.paid` / `subscription.updated` → `active`, and `past_due_since` is cleared. If every retry fails: `subscription.updated` → `unpaid` → Free.

**Unpaid (on hold)**
The project is on Free with an "on hold" banner offering two actions:
- **Pay now:** opens the Bachs customer portal, where the owner pays the outstanding invoice or updates their card. On success Bachs sends `subscription.updated` → `active`, and the project returns to its paid tier on the **same subscription**.
- **Switch to Free:** `POST /billing/switch-to-free` cancels the subscription immediately in Bachs. `subscription.deleted` → `canceled`, and the banner goes away.

While the status is `unpaid`, **Upgrade is blocked**: checkout returns `409 outstanding_payment`. The owner has to pay or switch to Free first.

**Plan change (later, once Business exists)**
`POST /billing/change-plan` → `PATCH /v1/subscriptions/{id}` with `{ product_id, proration_behavior }`:
- Upgrade: `invoice_now` (charge the difference now, new limits straight away)
- Downgrade: `next_cycle` (current tier until renewal; the webhook updates the tier when it applies)

---

## Webhooks

**Endpoint:** `POST /api/v1/billing/webhooks/bachs`. No auth dependency and no rate limit.

### Verification

1. Read the **raw body** before parsing it as JSON.
2. Pass the raw body, the request headers and `BACHS_WEBHOOK_SECRET` to the SDK's `bachs.webhooks.construct_event`. It checks the `X-Bachs-Signature-V2` header (falling back to `X-Bachs-Signature` + `X-Bachs-Timestamp`), rejects deliveries more than 300 seconds old or ahead, and parses the event.
3. Return `400` on any failure (`BachsWebhookError`, surfaced by our client as `InvalidWebhook`).

### Idempotency

Bachs delivers at least once. Insert `event.id` into `BillingEvent`; if it's already there, return `200` straight away without processing.

**Ordering:** events can arrive out of order. On `subscription.*` events, apply the payload only if `event.created_at >= ProjectSubscription.last_event_at`.

### Handled events

| Event | Action |
|---|---|
| `customer.subscription.created` | Read `metadata.project_id`, upsert `ProjectSubscription`, insert a `BillingCustomer` row for the payer if missing, set `User.trial_used_at` if `status = trialing` and it's empty |
| `customer.subscription.updated` | Upsert status (unrecognised → `canceled`), product → tier, period dates, `cancel_at_period_end`, `trial_end`. Clear `past_due_since` if the status is `active` |
| `customer.subscription.deleted` | Set status to `canceled` |
| `invoice.payment_failed` | Set `past_due_since` if it's empty |
| `invoice.paid` | Clear `past_due_since` |
| anything else | Log, `200` |

Return `200` quickly after a valid, deduped event is stored. Processing is plain DB writes, so it runs in the request; it doesn't need `BackgroundTasks`.

### Mapping events to projects

The checkout session is created with `metadata = { "project_id": "<uuid>", "owner_user_id": "<uuid>" }`. Bachs **copies checkout metadata onto the subscription**, so every `customer.subscription.*` event has `data.metadata.project_id`. Invoice events are matched through the subscription id.

---

## API Contract

All project routes require a bearer token. Checkout, portal and change-plan are limited to the project **owner**; `GET` is open to any project member.

### Get billing state
`GET /api/v1/projects/{project_slug}/billing`

Response `200`:
```json
{
  "tier": "pro",
  "status": "trialing",
  "currency": "NGN",
  "trial_end": "2026-10-22T00:00:00Z",
  "current_period_start": "2026-10-08T00:00:00Z",
  "current_period_end": "2026-11-08T00:00:00Z",
  "cancel_at_period_end": false,
  "past_due_since": null,
  "trial_eligible": false,
  "usage": {
    "links_per_period": { "used": 12, "limit": 1000 },
    "events_per_period": { "used": 3401, "limit": 50000 },
    "seats": { "used": 3, "limit": 10 }
  },
  "entitlements": {
    "custom_domains": 3,
    "link_folders": true,
    "analytics_retention_days": 365,
    "password_links": true,
    "link_expiry": true,
    "csv_export": true,
    "bulk_import": true,
    "priority_support": true,
    "geo_device_targeting": false
  }
}
```

For a Free project, `status` is `null`, the period dates are the calendar month, and `currency` is `null`.

### Start checkout
`POST /api/v1/projects/{project_slug}/billing/checkout`

Request:
```json
{ "tier": "pro" }
```

Response `200`:
```json
{ "checkout_url": "https://checkout.bachs.io/..." }
```

Errors:
- `409`, `code: subscription_exists` if the project has a `trialing`, `active` or `past_due` subscription; use the portal or change-plan instead.
- `409`, `code: outstanding_payment` if the project's subscription is `unpaid`; the owner must pay or switch to Free first.

Server side:
- Pick the trial or no-trial product from `User.trial_used_at`.
- `customer`: `{ "customer_id": <owner's BillingCustomer.provider_customer_id> }` if a row exists for Bachs, otherwise `{ "email", "name" }`.
- `success_url`: `{FRONTEND_URL}/dashboard/{slug}/settings/billing?checkout=success`
- `cancel_url`: `{FRONTEND_URL}/dashboard/{slug}/settings/billing`
- `metadata`: `{ project_id, owner_user_id }`
- `reference`: `f"{project_id}:{uuid4().hex[:8]}"` (unique per checkout)

### Open customer portal
`POST /api/v1/projects/{project_slug}/billing/portal`

Response `200`:
```json
{ "portal_url": "https://..." }
```

`404` if the owner has no `BillingCustomer` row for Bachs.

### Switch to Free
`POST /api/v1/projects/{project_slug}/billing/switch-to-free`

Only allowed when the subscription is `unpaid`. It cancels the subscription in Bachs immediately (`DELETE /v1/subscriptions/{id}` with `cancel_at_period_end: false`).

Response `200`: the billing state, with `status: "canceled"` and `tier: "free"`. The webhook confirms it afterwards.

`409`, `code: not_unpaid` for any other status. Owners on `active` or `trialing` cancel through the portal, which cancels at the end of the period.

### Change plan *(later, with Business)*
`POST /api/v1/projects/{project_slug}/billing/change-plan`

Request:
```json
{ "tier": "business" }
```

Response `200`: the billing state as above, from the PATCH response. The webhook confirms it afterwards.

### Webhook
`POST /api/v1/billing/webhooks/bachs`. See [Webhooks](#webhooks).

---

## Data Model Changes

Billing tables are **provider-neutral**: provider ids live in `provider_*` columns next to a `provider` column, so moving away from Bachs later means new rows, not new columns. Enum columns are stored as `VARCHAR(32)` holding the enum **values** (`"pro"`, `"past_due"`), not native Postgres enums, so adding a provider, tier or status needs no migration.

### `User` (additions)

| Column | Type | Notes |
|---|---|---|
| `trial_used_at` | `TIMESTAMP` nullable | Set when the owner's first `trialing` subscription is created. Kept on `User` because trial eligibility doesn't depend on the provider |

### `BillingCustomer` (new)

| Column | Type | Notes |
|---|---|---|
| `user_id` | `UUID` FK → `user.id` | composite PK |
| `provider` | `BillingProvider` | composite PK |
| `provider_customer_id` | `VARCHAR` | `cust_...` for Bachs; unique per provider |
| `created_at` | `TIMESTAMP` | |

### `ProjectSubscription` (new)

One row per project that has ever subscribed. No row means Free.

| Column | Type | Notes |
|---|---|---|
| `project_id` | `UUID` PK, FK → `project.id` | |
| `payer_user_id` | `UUID` FK → `user.id` | The owner who paid |
| `provider` | `BillingProvider` | |
| `provider_subscription_id` | `VARCHAR` | `sub_...`; unique per provider |
| `provider_product_id` | `VARCHAR` | `prod_...` |
| `tier` | `PlanTier` | Mapped from the product id |
| `status` | `SubscriptionStatus` | `trialing`, `active`, `past_due`, `unpaid`, `canceled` |
| `currency` | `VARCHAR(3)` | `NGN` / `USD` |
| `current_period_start` | `TIMESTAMP` | |
| `current_period_end` | `TIMESTAMP` | |
| `trial_end` | `TIMESTAMP` nullable | |
| `cancel_at_period_end` | `BOOLEAN` | default `false` |
| `past_due_since` | `TIMESTAMP` nullable | When the first renewal failed; shown in the banner |
| `last_event_at` | `TIMESTAMP` | `created_at` of the last applied webhook, used to guard ordering |
| `created_at` / `updated_at` | `TIMESTAMP` | |

If a project subscribes again after cancelling, the same row is overwritten with the new `provider_subscription_id`. Bachs keeps the full history.

### `ProjectUsage` (new)

| Column | Type | Notes |
|---|---|---|
| `project_id` | `UUID` FK → `project.id` | composite PK |
| `period_start` | `TIMESTAMP` | composite PK |
| `period_end` | `TIMESTAMP` | |
| `links_created` | `INTEGER` | default `0` |
| `events_tracked` | `INTEGER` | default `0` |
| `links_warned_80_at` / `links_warned_100_at` | `TIMESTAMP` nullable | |
| `events_warned_80_at` / `events_warned_100_at` | `TIMESTAMP` nullable | |

### `BillingEvent` (new)

| Column | Type | Notes |
|---|---|---|
| `provider` | `BillingProvider` | composite PK |
| `id` | `VARCHAR` | composite PK; Bachs `evt_...` |
| `type` | `VARCHAR` | |
| `received_at` | `TIMESTAMP` | |

### Enums (`be/models/billing.py`)

```python
class BillingProvider(str, enum.Enum):
    Bachs = "bachs"

class PlanTier(str, enum.Enum):
    Free = "free"
    Pro = "pro"
    # Business = "business"

class SubscriptionStatus(str, enum.Enum):
    Trialing = "trialing"
    Active = "active"
    Past_due = "past_due"
    Unpaid = "unpaid"
    Canceled = "canceled"
```

### Prerequisite fix (done)

`ProjectRole.Onwer` was renamed to `Owner`. The migration runs `ALTER TYPE projectrole RENAME VALUE 'Onwer' TO 'Owner'`.

---

## Backend Layout

| File | Responsibility |
|---|---|
| `config/plans.py` | `PlanLimits`, `PLANS` dict, product id → tier map (`PlanTier` itself lives in `models/billing.py`) |
| `config/environment.py` | New settings: `bachs_api_key`, `bachs_webhook_secret`, `bachs_pro_product_id`, `bachs_pro_trial_product_id`, `frontend_url` |
| `models/billing.py` | `BillingCustomer`, `ProjectSubscription`, `ProjectUsage`, `BillingEvent`, and the `BillingProvider` / `PlanTier` / `SubscriptionStatus` enums |
| `schemas/billingSchema.py` | Request/response models above |
| `crud/billing.py` | Subscription upsert, usage upsert and atomic increments, event dedupe insert |
| `services/bachs_client.py` | Thin wrapper around the official `bachs` Python SDK (`AsyncBachs`): `create_checkout_session`, `create_portal_session`, `cancel_subscription`, `verify_webhook`. Translates SDK errors into our own `BachsError` / `InvalidWebhook` and maps Bachs statuses to `SubscriptionStatus` |
| `services/billing_service.py` | Webhook dispatch, checkout and portal orchestration, status → tier |
| `services/entitlements.py` | `get_plan(project)`, `get_current_usage(project)`, `check_limit(...)`, `require_feature(...)`, raising the `402` errors |
| `routers/billingRouter.py` | Routes above; thin |

**Bachs SDK:** we use the official `bachs` package (v2, released October 2026) instead of raw HTTP calls. It handles authentication, retries, timeouts, idempotency keys and webhook signature checks. The sandbox or production API is picked from the key prefix (`sk_sandbox_` / `sk_live_`), so there's no base URL setting. `bachs_client.py` is the only file that imports the SDK: services and routers only see our own functions and exceptions, so an SDK upgrade or a provider change stays in one file.

**Changes to existing code:**
- Link creation (link router or service): call `check_limit(project, "links_per_period")` before inserting, and increment the counter after.
- Click recording (`services/link_service.py` background task): check the event limit **inside the background task** and skip the insert when the project is over it. The redirect path doesn't change.
- Adding project members: `check_limit(project, "seats")`.
- New projects: no billing row is needed; with no row, a project is Free.

---

## Frontend

| File | Purpose |
|---|---|
| `app/dashboard/[slug]/settings/billing/page.tsx` | Billing page |
| `lib/billing.ts` | `getBilling`, `startCheckout`, `openPortal`, `switchToFree` (axios) |
| `hooks/usePlan.ts` | Fetches billing state; exposes `tier`, `entitlements`, `usage`, `can(feature)` |
| `components/billing/PlanCard.tsx` | Free and Pro cards with price in the local currency and an Upgrade / Current plan / Manage button |
| `components/billing/UsageMeter.tsx` | Progress bar per limit; amber at 80%, red at 100% |
| `components/billing/UpgradeDialog.tsx` | Opened by the global `402` handler |
| `components/billing/BillingBanner.tsx` | Dashboard banner for trial ending, past due, on hold (unpaid), or tracking paused |

### Billing page

- **Header:** current tier badge and status (e.g. "Pro · Trial ends Oct 22", "Pro · Payment failed: update card", "Pro · Cancels Nov 8", "Free · Pro on hold: payment outstanding").
- **Unpaid:** the Pro card's Upgrade button is replaced by **Pay now** (opens the portal) and **Switch to Free** (asks for confirmation, then calls `switchToFree`).
- **Usage:** three `UsageMeter`s (links, events, seats) with "resets on <date>".
- **Plans:** Free and Pro cards. The Pro button reads "Start 14-day free trial" if `trial_eligible`, otherwise "Upgrade to Pro". Members who aren't the owner see the button disabled with the note "Only the project owner can change the plan".
- **Manage billing:** owner only, opens the portal URL.
- **`?checkout=success`:** shows "Activating your plan…" and polls `GET /billing` every 2s for up to 30s, then a success toast. On timeout: "Payment received; your plan will update shortly."

### Global 402 handling

An axios response interceptor in `lib/` catches `402` responses with `code: plan_limit_reached | feature_not_in_plan` and opens `UpgradeDialog` with text matching the error ("You've created 30/30 links this month").

### Feature gating

UI for gated features (custom domains, folders, export…) checks `usePlan().can("feature")`. It shows the control with a lock icon and opens the upgrade dialog on click, rather than hiding it.

---

## Environment Variables

| Variable | Workspace | Notes |
|---|---|---|
| `BACHS_API_KEY` | be | `sk_sandbox_...` in dev, `sk_live_...` in prod. The prefix also picks the sandbox or production API |
| `BACHS_WEBHOOK_SECRET` | be | `whsec_...` |
| `BACHS_PRO_PRODUCT_ID` | be | |
| `BACHS_PRO_TRIAL_PRODUCT_ID` | be | |
| `FRONTEND_URL` | be | Used for checkout success and cancel URLs |

---

## Rollout Phases

1. **Foundation:** fix `ProjectRole`, add `config/plans.py`, billing models and migration, `entitlements` service and usage counters. Enforce Free limits on link creation, click recording and seats. Every project is Free at this point.
2. **Bachs integration:** `bachs_client`, checkout, portal, webhook endpoint. End-to-end test in sandbox: trial, conversion, failed payment, cancel, subscribing again.
3. **Frontend:** billing page, `usePlan`, `402` interceptor, banners.
4. **Launch:** create live products, set prices, configure the live webhook, set failed-payment recovery to **"Mark unpaid"**, migrate existing projects (see open questions).
5. **Pro features:** each in its own PRD (custom domains, folders, retention, export, password and expiry, bulk import).
6. **Business tier:** add the enum value, `PLANS` entry, Bachs product and env var, plus the `change-plan` route.

---

## Testing

- **Unit:** status → tier mapping (`past_due` keeps the paid tier, `unpaid` is Free, unrecognised Bachs statuses become `canceled`); checkout returns `409 outstanding_payment` while `unpaid`; period calculation for Free (month boundaries) and paid; webhook signature verification (valid, wrong secret, stale timestamp, tampered body).
- **Integration (sandbox):** run every webhook through `/guides/webhooks/replay-events`, including a duplicate and an out-of-order `subscription.updated`.
- **Limits:** the 31st link on Free returns `402`; the 5,001st click on Free still redirects and writes no `Click` row; deleting a link doesn't free quota.
- **Trial:** a second project for the same owner gets the no-trial product.

---

## Risks

| Risk | Mitigation |
|---|---|
| Bachs is not a Merchant of Record; spit.sh stays the seller for tax purposes | Bachs calculates tax/VAT; review obligations before selling outside Nigeria at scale |
| Recurring charges may not work for every payment method (e.g. NGN bank transfer can't be charged automatically) | Check in sandbox which methods Bachs allows for recurring products; limit `payment_method_types` on subscription checkouts if needed |
| International card fee (5% + 40¢) takes about 8% of a $15 plan | Accept for v1; yearly billing later reduces fees per month |
| The Bachs platform and SDK are young | All SDK use is isolated in `bachs_client.py`; webhooks are the source of truth; keep an admin script that refetches a subscription from the API |
| A webhook is missed or delayed and a paying customer stays on Free | Success page polling plus a "Refresh plan" admin action that pulls the subscription from Bachs |

---

## Open Questions

1. **Existing projects at launch:** grandfather them (give current projects free Pro, permanently or for N months), or move everyone to Free on day one? Projects over the Free limits keep all their links either way.
2. **Pro price:** final USD and NGN amounts.
3. **Custom domain cap on Pro:** 3, or unlimited?
4. **Ownership transfer:** if a paid project changes owner, the subscription stays billed to the old owner until it's cancelled. Is that acceptable for v1?
5. **Outstanding invoice after Switch to Free:** once an `unpaid` subscription is cancelled, can the owner upgrade again with a new checkout, or must the old invoice be paid first? Depends on whether Bachs voids the invoice on cancel (check in sandbox).

---

## Future Work

- Yearly billing: needs yearly products for every tier, since plan changes must keep the same interval.
- Business tier: `geo_device_targeting`, SSO, audit log, higher limits.
- Email notifications for usage warnings and failed payments.
- Paid add-ons (extra seats, extra event packs) using Bachs usage-based billing.

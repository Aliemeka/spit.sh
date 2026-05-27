# Analytics PRD (Backend)

## Overview

spit-sh records a `Click` row for every redirect ([`be/routers/linkRouter.py`](../../../be/routers/linkRouter.py)) but only surfaces aggregate counts today. This PRD specifies a backend analytics API that powers the dashboard analytics page — a single endpoint, scoped to a project, that returns clicks-over-time and breakdowns by country, city, device, browser, OS, referrer, and UTM parameters. An optional `linkId` filter narrows the same response to a single link within the project.

The API design mirrors [Dub's `/analytics` endpoint](https://dub.co/docs/api-reference/endpoint/retrieve-analytics): one route, one set of filters, and a `groupBy` parameter that switches the response shape. This keeps the route count low, the frontend client simple, and lets us swap the underlying query (raw → rollup table) later without touching the contract.

This PRD covers only the backend. The frontend analytics page is covered in a separate PRD.

---

## User Stories

1. As a project member, I can view total clicks for my project — or for a single link within it — over a chosen time window (24h, 7d, 30d, 90d, or all-time).
2. As a project member, I can see how clicks are distributed over time (line chart) for the project, or narrowed to a single link.
3. As a project member, I can see which countries, cities, devices, browsers, operating systems, and referring domains drove clicks.
4. As a project member, I can see which UTM source / medium / campaign brought clicks to my links.
5. As a project member, I can filter any breakdown by any other dimension (e.g. "show me the timeseries for clicks from `US` on `mobile` from referer `twitter.com`").
6. As a project member, I cannot see analytics for projects I don't belong to.

---

## Data Model Changes

### `Click` table — new columns

| Column         | Type           | Nullable | Default      | Notes                                                                                                                                         |
| -------------- | -------------- | -------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `browser`      | `VARCHAR(64)`  | yes      | `"unknown"`  | Parsed from User-Agent (e.g. `"Chrome"`, `"Safari"`, `"Firefox"`)                                                                             |
| `os`           | `VARCHAR(64)`  | yes      | `"unknown"`  | Parsed from User-Agent (e.g. `"Mac OS X"`, `"Windows"`, `"iOS"`, `"Android"`)                                                                 |
| `referer`      | `VARCHAR(255)` | yes      | `"(direct)"` | Hostname of HTTP `Referer` header (e.g. `"twitter.com"`). Full URL not stored in v1. Value is `"(direct)"` when no Referer header is present. |
| `utm_source`   | `VARCHAR(255)` | yes      | `null`       | Snapshotted from the `Link` row at click time                                                                                                 |
| `utm_medium`   | `VARCHAR(255)` | yes      | `null`       | Snapshotted from the `Link` row at click time                                                                                                 |
| `utm_campaign` | `VARCHAR(255)` | yes      | `null`       | Snapshotted from the `Link` row at click time                                                                                                 |
| `utm_term`     | `VARCHAR(255)` | yes      | `null`       | Snapshotted from the `Link` row at click time                                                                                                 |
| `utm_content`  | `VARCHAR(255)` | yes      | `null`       | Snapshotted from the `Link` row at click time                                                                                                 |

UTM snapshotting (vs. joining to `Link` at query time) is intentional — it preserves the UTM values that drove a historical click even if the link's UTMs are later edited.

### Indexes

Composite indexes to support the breakdown + filter queries:

| Index                   | Columns                      | Purpose                                          |
| ----------------------- | ---------------------------- | ------------------------------------------------ |
| `ix_click_link_created` | `(link_id, created_at)`      | Per-link timeseries and time-filtered breakdowns |
| `ix_click_country`      | `(country_code, created_at)` | Country breakdown / filter                       |
| `ix_click_device`       | `(device, created_at)`       | Device breakdown / filter                        |
| `ix_click_referer`      | `(referer, created_at)`      | Referer breakdown / filter                       |

Existing `Click` rows backfill with the column defaults (`"unknown"` / `"(direct)"` / `null`). No retroactive UA re-parsing.

### Migration

A single Alembic migration adds all eight columns and the four indexes. Generated via:

```bash
cd be && uv run alembic revision --autogenerate -m "add analytics fields to click"
```

---

## Click Recording Changes

The existing `record_click()` service ([`be/services/link_service.py:34-46`](../../../be/services/link_service.py#L34-L46)) is extended to:

1. Parse `browser` and `os` from the User-Agent using the [`user-agents`](https://pypi.org/project/user-agents/) library (`uv add user-agents`). The library wraps `ua-parser` and exposes `parse(ua).browser.family` and `parse(ua).os.family`. Falls back to `"unknown"` on parse failure.
2. Capture the `Referer` header from the redirect request, extract hostname via `urllib.parse.urlparse(...).hostname`. Falls back to `"(direct)"` when missing or unparseable.
3. Snapshot the link's `utm_*` fields onto the new `Click` row.

The redirect route ([`be/routers/linkRouter.py:46-68`](../../../be/routers/linkRouter.py#L46-L68)) is updated to pass `request.headers.get("referer")` and the link's UTM fields into `record_click()`.

All recording continues to run in a `BackgroundTask` — no impact on redirect latency. UA parsing is CPU-bound but trivially fast; no executor offload needed.

---

## API Contract

### `GET /api/v1/analytics/{project-slug}`

Single endpoint, scoped to a project via the path param. The `groupBy` query parameter switches the response shape.

**Auth:** Bearer token required (`Depends(get_current_user)`). The user must be a member of the project (verified via `is_project_member`, same pattern as [`projectRouter._get_project_or_403`](../../../be/routers/projectRouter.py#L31-L41)).

**Rate limit:** `60/minute` per IP (via the shared `limiter` from [`be/utils/limiter.py`](../../../be/utils/limiter.py)).

#### Path parameters

| Param          | Type   | Notes                                                                                               |
| -------------- | ------ | --------------------------------------------------------------------------------------------------- |
| `project_slug` | string | The project to scope analytics to. Returns `404` if not found, `403` if the caller is not a member. |

#### Query parameters

**Narrowing:**

| Param    | Type           | Notes                                                                                                                             |
| -------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `linkId` | UUID, optional | When set, restricts the response to a single link. Returns `404` if the link does not exist or does not belong to `project_slug`. |

**Time range:**

| Param      | Type | Default | Values                           |
| ---------- | ---- | ------- | -------------------------------- |
| `interval` | enum | `24h`   | `24h`, `7d`, `30d`, `90d`, `all` |

`interval` is resolved server-side to `(start, end)` UTC datetimes. `all` means "since the link/project's earliest click".

**Grouping:**

| Param     | Type | Default | Values                                                                                                                               |
| --------- | ---- | ------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `groupBy` | enum | `count` | `count`, `timeseries`, `countries`, `cities`, `devices`, `browsers`, `os`, `referers`, `utm_sources`, `utm_mediums`, `utm_campaigns` |

**Dimension filters (all optional, all apply as additional `WHERE` clauses on the underlying click query and compose with `linkId`):**

| Param          | Type              | Notes                                                                      |
| -------------- | ----------------- | -------------------------------------------------------------------------- |
| `country`      | 2-letter ISO code | Matches `country_code` column                                              |
| `city`         | string            | Exact match                                                                |
| `device`       | enum              | `desktop`, `mobile`, `tablet`, `unknown`                                   |
| `browser`      | string            | e.g. `Chrome`                                                              |
| `os`           | string            | e.g. `iOS`                                                                 |
| `referer`      | string            | Hostname, e.g. `twitter.com`. Pass `(direct)` to filter to direct traffic. |
| `utm_source`   | string            |                                                                            |
| `utm_medium`   | string            |                                                                            |
| `utm_campaign` | string            |                                                                            |

#### Response schemas

For **`groupBy=count`** (default):

```json
{ "clicks": 1834 }
```

For **`groupBy=timeseries`** — array of buckets. Bucket granularity is derived from `interval`:

| Interval | Granularity         |
| -------- | ------------------- |
| `24h`    | hourly (24 buckets) |
| `7d`     | daily (7 buckets)   |
| `30d`    | daily (30 buckets)  |
| `90d`    | daily (90 buckets)  |
| `all`    | daily               |

```json
[
  { "start": "2026-05-19T00:00:00Z", "clicks": 42 },
  { "start": "2026-05-20T00:00:00Z", "clicks": 51 }
]
```

Empty buckets are included with `clicks: 0` so the frontend doesn't have to fill gaps.

For **`groupBy=countries`** — sorted desc by `clicks`:

```json
[
  { "country": "US", "country_code": "US", "clicks": 312 },
  { "country": "United Kingdom", "country_code": "GB", "clicks": 87 }
]
```

For **`groupBy=cities`**:

```json
[
  { "city": "San Francisco", "country_code": "US", "clicks": 121 },
  { "city": "London", "country_code": "GB", "clicks": 64 }
]
```

For **`groupBy=devices`**, **`browsers`**, **`os`**:

```json
[
  { "device": "mobile", "clicks": 812 },
  { "device": "desktop", "clicks": 940 },
  { "device": "tablet", "clicks": 82 }
]
```

(Replace key with `browser` or `os` for the respective groupBy.)

For **`groupBy=referers`**:

```json
[
  { "referer": "twitter.com", "clicks": 420 },
  { "referer": "(direct)", "clicks": 318 },
  { "referer": "news.ycombinator.com", "clicks": 91 }
]
```

For **`groupBy=utm_sources`**, **`utm_mediums`**, **`utm_campaigns`** — null UTM values are excluded:

```json
[
  { "utm_source": "newsletter", "clicks": 230 },
  { "utm_source": "twitter", "clicks": 145 }
]
```

#### Status codes

| Code  | When                                                                           |
| ----- | ------------------------------------------------------------------------------ |
| `200` | Success                                                                        |
| `401` | Missing/invalid bearer token                                                   |
| `403` | User is not a member of the project                                            |
| `404` | `project_slug` does not exist, or `linkId` does not belong to the project      |
| `422` | Validation error (unknown `groupBy`, malformed UUID, invalid `interval`, etc.) |
| `429` | Rate limit exceeded                                                            |

---

## Implementation Notes

### File layout (new files)

```
be/
├── routers/
│   └── analyticsRouter.py     # NEW — mounted at /api/v1/analytics, single GET /{project_slug} route
├── services/
│   └── analytics_service.py   # NEW — query builders, interval → (start, end), bucket filling
├── schemas/
│   └── analyticsSchema.py     # NEW — request validation + per-groupBy response models
└── crud/
    └── analytics.py           # NEW — raw SQL/SQLAlchemy aggregation queries
```

### Files to modify

| File                                                                  | Change                                                             |
| --------------------------------------------------------------------- | ------------------------------------------------------------------ |
| [`be/models/base.py`](../../../be/models/base.py)                     | Add 8 new columns to `Click`                                       |
| [`be/schemas/clickSchema.py`](../../../be/schemas/clickSchema.py)     | Add new fields to `ClickCreate`                                    |
| [`be/services/link_service.py`](../../../be/services/link_service.py) | UA parsing (browser/os), referer hostname extraction, UTM snapshot |
| [`be/crud/click.py`](../../../be/crud/click.py)                       | Update `create_click` for new columns                              |
| [`be/routers/linkRouter.py`](../../../be/routers/linkRouter.py)       | Pass `Referer` header + link's UTMs into `record_click`            |
| [`be/main.py`](../../../be/main.py)                                   | Register `analyticsRouter`                                         |
| [`be/pyproject.toml`](../../../be/pyproject.toml)                     | `uv add user-agents`                                               |
| `be/migrations/versions/...`                                          | New Alembic migration                                              |

### Layering

- **Router** — only param parsing, auth, project resolution (`_get_project_or_403`), optional `linkId` ownership check, rate limiting. Delegates to service.
- **Service** — resolves `interval` → `(start, end)`, dispatches on `groupBy`, calls the matching CRUD function, fills empty timeseries buckets, shapes the response.
- **CRUD** — pure SQLAlchemy `select(...).group_by(...).where(...)` queries against `Click`, always joined to `Link` and filtered by `project_id`. One function per `groupBy`. No business logic, no HTTP.

### Future rollup compatibility

Today every breakdown query scans the `clicks` table within the time window. The response shapes above are dimension-only — they do **not** expose row IDs or anything that would tie the response to a particular storage layer. When `clicks` scales past ~100k rows per link, a daily/hourly rollup table (e.g. `click_rollup_daily(link_id, date, country_code, device, browser, os, referer, utm_source, utm_medium, utm_campaign, count)`) can be added behind the existing CRUD functions without any API change.

---

## Out of Scope (this PRD)

- Frontend analytics page (separate PRD)
- Custom date ranges (only presets in v1)
- Compare-to-previous-period
- Full referer URLs (only hostnames in v1)
- Continent / region breakdowns
- Top-links ranking (a single project-scoped `linkId` filter handles the common case)
- QR vs link trigger distinction (no QR codes yet)
- Unique visitor / session deduplication (every redirect = one click)
- Real-time / streaming analytics
- CSV / PDF export
- Conversion / lead / sale tracking
- Public (unauthenticated) analytics endpoints
- Precomputed rollup tables
- Webhooks for click events

---

## Verification

Once implemented:

1. **Migration applies clean.** `uv run alembic upgrade head` runs without error on a fresh DB and on a DB with existing `Click` rows.
2. **Click recording captures new fields.** Hit a short link with `curl -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15" -H "Referer: https://twitter.com/foo"` and verify the new `Click` row has `browser="Mobile Safari"`, `os="iOS"`, `referer="twitter.com"`, and the link's UTMs snapshotted.
3. **Each `groupBy` returns the documented shape.** With a seeded dataset (script to insert ~500 clicks across countries/devices/browsers), hit `GET /api/v1/analytics/{project-slug}?groupBy=<each>` and verify response shape matches this PRD. Repeat with `&linkId=<id>` to confirm the same shapes when narrowed to a single link.
4. **Filter composition works.** `GET /api/v1/analytics/{project-slug}?groupBy=timeseries&country=US&device=mobile` returns only US-mobile clicks bucketed over time. Composing with `linkId` further restricts to that link.
5. **Cross-project linkId is rejected.** `GET /api/v1/analytics/{slug-A}?linkId=<id-belonging-to-project-B>` returns `404`.
6. **Auth boundary holds.** A bearer token for a non-member returns `403`. A request without a token returns `401`.
7. **Empty timeseries buckets are present.** A 7d query for a link with clicks on only 2 days returns 7 buckets, 5 with `clicks: 0`.
8. **Rate limit fires at 61/min.**

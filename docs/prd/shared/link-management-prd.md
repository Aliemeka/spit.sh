# Link Management PRD

## Overview

Link management is the core feature of spit.sh. Users create short links within a project, optionally attach metadata (tags, UTM parameters), and view their link performance over time. This PRD covers the creation flow, link listing UI, and the data model that backs both.

---

## User Stories

1. As a user, I can create a short link within a project by entering a destination URL, optionally customising the slug, selecting tags, and attaching UTM parameters.
2. As a user, I can see a real-time preview of the destination URL's OG metadata (image, title, description) while filling out the creation form.
3. As a user, I can view all links in a project listed with their short URL, destination, engagement count, date created, and tags.
4. As a user, I can copy a short link, edit it, or delete it directly from the list.
5. As a user, clicks on my short links are tracked with geo (country, city) and device type (mobile, tablet, desktop).

---

## Tags

Tags are predefined and fixed. A link can have multiple tags.

| Tag | Description |
|-----|-------------|
| `invite` | Meeting and webinar invite links |
| `product-launch` | Links tied to new product releases |
| `lead` | Lead generation and capture links |
| `social` | Links to social media posts and group chats |
| `email` | Links dropped in newsletters or email campaigns |
| `blog` | Links embedded in blog posts or articles |
| `affiliate` | Partner or referral links |
| `internal` | Internal team links (docs, dashboards, etc.) |
| `event` | Webinar, meetup, or conference links |
| `promo` | Discount codes, sales pages, limited-time offers |
| `support` | Help docs, FAQ pages, onboarding links |
| `retargeting` | Links used in retargeting or remarketing campaigns |
| `test` | QA or staging links not counted in real analytics |

---

## UTM Parameters

| Field | Required | Description |
|-------|----------|-------------|
| `utm_source` | Yes (if UTM enabled) | Who sent the traffic (e.g. `twitter`, `newsletter`) |
| `utm_medium` | Yes (if UTM enabled) | How it was delivered (e.g. `social`, `email`, `cpc`) |
| `utm_campaign` | Yes (if UTM enabled) | Campaign name (e.g. `black_friday_2025`) |
| `utm_term` | No | Keyword for paid search ads |
| `utm_content` | No | Differentiates similar links (e.g. `header_cta` vs `footer_cta`) |

UTM fields are appended to the destination URL before saving, not to the short URL. The full UTM-appended URL is stored in the `url` field on the `Link` model.

---

## Link Creation Modal

**Trigger:** Clicking "Create new link" sets `?action=new_link` in the URL query params. The links page renders the modal when this param is present. Closing or successfully submitting the modal removes the param via `router.replace`.

**Layout:** Horizontally wide dialog. `grid grid-cols-5` at the top level of modal content.

### Left panel — `col-span-3`

1. **Destination URL** — Text input. On blur (when URL is valid), triggers an OG preview fetch against the internal `/api/og-preview` route.
2. **Slug** — Hidden by default. A toggle button ("Customise slug") reveals a text input. If left empty the backend auto-generates a 7-character slug via `generate_slug()`.
3. **Tags** — Multi-select. Renders the 13 predefined tags as clickable pill badges. Selected tags are highlighted in fuchsia. Clicking again deselects.
4. **UTM** — Collapsible section toggled by "Add UTM parameters". When expanded, shows five labelled inputs: source, medium, campaign, term, content.

### Right panel — `col-span-2`

- **OG Preview card** — Shows the destination page's OG image (full-width), title, and description. Displays a skeleton placeholder while loading or when the URL is empty/invalid.
- Preview is fetched from `/api/og-preview?url=<destination>` (internal Next.js API route — server-side fetch, no CORS issues).

Form handling: `formik` + `yup` validation. Calls `createProjectLink` on submit. On success: removes `action` query param, triggers links list refresh.

---

## Link List UI

Each link is displayed as a card row. Styling follows the spit.sh colour scheme: fuchsia accent, zinc neutrals, dark-mode support.

**Card anatomy (left → right):**

| Section | Content |
|---------|---------|
| Favicon | 16×16 favicon fetched from `https://www.google.com/s2/favicons?domain=<host>&sz=32` |
| Title block | OG title or domain name (bold), fuchsia short URL with copy icon, muted destination URL (truncated) |
| Metadata | Engagement count + ArrowsClockwise icon, creation date + CalendarBlank icon, tag pills + Tag icon |
| Actions | PencilSimple (edit), ShareNetwork (share), ChartBar (analytics), DotsThree (more/delete) — all Phosphor Icons |

Empty state: `EmptyState` component with "No links yet" and a "Create new link" CTA.

---

## API Contract

### Create link
`POST /api/v1/projects/{project_slug}/links`

**Auth:** Bearer token required.

Request body:
```json
{
  "url": "https://example.com",
  "slug": "my-slug",
  "tags": ["social", "promo"],
  "utm_source": "twitter",
  "utm_medium": "social",
  "utm_campaign": "launch_w25",
  "utm_term": null,
  "utm_content": null
}
```

Response `201`:
```json
{
  "id": "uuid",
  "url": "https://example.com?utm_source=twitter&utm_medium=social&utm_campaign=launch_w25",
  "slug": "my-slug",
  "shortenUrl": "https://spit.sh/my-slug",
  "tags": ["social", "promo"],
  "utm_source": "twitter",
  "utm_medium": "social",
  "utm_campaign": "launch_w25",
  "utm_term": null,
  "utm_content": null,
  "click_count": 0,
  "created_at": "2026-03-16T12:00:00Z"
}
```

### List project links
`GET /api/v1/projects/{project_slug}/links`

**Auth:** Bearer token required.

Response `200`: Array of link response objects (same shape as above).

### Update link
`PATCH /api/v1/projects/{project_slug}/links/{link_id}`

**Auth:** Bearer token required. Partial update — any combination of `url`, `slug`, `tags`, `utm_*`.

### Delete link
`DELETE /api/v1/projects/{project_slug}/links/{link_id}`

**Auth:** Bearer token required. Response `204` no content.

---

## Click Tracking

Every visit to a short link records a `Click` row with:

| Field | Source |
|-------|--------|
| `ip_address` | `request.client.host` |
| `country` | MaxMind GeoLite2-City DB via `geoip2` |
| `city` | MaxMind GeoLite2-City DB via `geoip2` |
| `country_code` | MaxMind GeoLite2-City DB via `geoip2` |
| `device` | User-Agent header — regex-based detection (`mobile` / `tablet` / `desktop` / `unknown`) |

Tracking runs in a FastAPI `BackgroundTask` so it never blocks the redirect response.

The path to the MaxMind `.mmdb` file is configured via `GEOIP_DB_PATH` env var in `config/environment.py`.

---

## Data Model Changes

### `Link` (additions)

| Column | Type | Notes |
|--------|------|-------|
| `utm_source` | `VARCHAR` nullable | |
| `utm_medium` | `VARCHAR` nullable | |
| `utm_campaign` | `VARCHAR` nullable | |
| `utm_term` | `VARCHAR` nullable | |
| `utm_content` | `VARCHAR` nullable | |

### `Click` (additions)

| Column | Type | Notes |
|--------|------|-------|
| `device` | `VARCHAR` | default `"unknown"` |

### `LinkTag` (new table)

| Column | Type | Notes |
|--------|------|-------|
| `link_id` | `UUID` FK → `link.id` | composite PK |
| `tag` | `VARCHAR` | composite PK, one of 13 predefined values |

---

## Out of Scope (this PRD)

- Analytics page / click breakdown charts
- Link search and filtering
- Pagination
- Bulk actions (select + delete multiple)
- Edit link modal (follow-up)
- QR code generation
- Custom domain support

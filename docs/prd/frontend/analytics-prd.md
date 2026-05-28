# Analytics PRD (Frontend)

## Overview

The backend exposes a single dimension-pivoting analytics endpoint ([`be/routers/analyticsRouter.py`](../../../be/routers/analyticsRouter.py)) that returns clicks-over-time and breakdowns by country, city, device, browser, OS, referrer, and UTM parameters. This PRD specifies the frontend that consumes it — the `/dashboard/[project-slug]/analytics` page.

The design models Dub.co's analytics dashboard: a global filter bar at the top, a hero area chart of clicks-over-time, and a grid of breakdown widgets below. Clicking a link row narrows every widget on the page to that one link. The page supports light + dark mode, defaults to a 24-hour window, and runs many requests in parallel — one per widget, all sharing the same filter state.

This PRD covers only the frontend. The backend contract is documented in [`docs/prd/backend/analytics-prd.md`](../backend/analytics-prd.md).

---

## User Stories

1. As a project member, I land on `/dashboard/[project-slug]/analytics` and see total clicks + a clicks-over-time chart for the last 24 hours, with breakdowns by short link, country, city, referrer, device, browser, OS, and UTM source/medium/campaign — all loaded in parallel.
2. As a project member, I can change the time range (24h, 7d, 30d, 90d, all) from one dropdown and every widget refetches.
3. As a project member, I can apply filters from one top-bar (link, country, device) and every widget refetches with those filters applied. Active filters render as removable chips.
4. As a project member, I see a locked "Domain (Pro)" filter that tells me custom domains require a paid plan.
5. As a project member, I can click a row in the Short Links widget to drill into that one link — the URL becomes `?linkId=<id>` and every widget refetches scoped to it.
6. As a project member, I use the app in either light or dark mode and every chart adapts.
7. As a project member, while data is loading I see widget-level skeleton loaders instead of layout shift.

---

## Page Layout

`/dashboard/[project-slug]/analytics` rendered inside the existing [`DashboardLayout`](../../../frontend/layouts/DashboardLayout.tsx) (`title="Analytics"`).

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Filter bar (sticky, top)                                                │
│  [Filter ▾]   [Last 24 hours ▾]                          [Domain (Pro)]  │
│  Active: [Link: /promo ×]  [Country: US ×]                               │
├──────────────────────────────────────────────────────────────────────────┤
│  Clicks  (KPI tile + area chart, full-width)                             │
│   1,834                                                                  │
│   ┌────────────────────────────────────────────────────────────────┐     │
│   │              ╱╲       ╱╲                                       │     │
│   │      ╱╲    ╱  ╲   ╱   ╲   area chart  ~280px tall              │     │
│   │   ╱╱    ╲╱    ╲╱       ╲╱                                      │     │
│   └────────────────────────────────────────────────────────────────┘     │
├──────────────────────────────────────────────────────────────────────────┤
│  ┌──────── Short Links ────────┐  ┌──────── Referrers ────────────┐      │
│  │ [fv] /launch   ████████  312│  │ twitter.com   ████████   420 │      │
│  │ [fv] /promo    █████     187│  │ (direct)      ██████     318 │      │
│  │ [fv] /docs     ██         64│  │ news.yc       ██          91 │      │
│  └─────────────────────────────┘  └──────────────────────────────┘      │
├──────────────────────────────────────────────────────────────────────────┤
│  ┌──────── Countries ──────────┐  ┌──────── Cities ───────────────┐      │
│  │ 🇺🇸 United States ████████ 245│  │ San Francisco ████████   121 │      │
│  │ 🇬🇧 United Kingdom █████   108│  │ London        ██████      64 │      │
│  │ 🇳🇬 Nigeria       ██        72│  │ Berlin        ██          38 │      │
│  └─────────────────────────────┘  └──────────────────────────────┘      │
├──────────────────────────────────────────────────────────────────────────┤
│  ┌─────────── Devices · Browsers · OS  (tabbed) ──────────────────┐     │
│  │  [Devices | Browsers | OS]                                      │     │
│  │                                                                 │     │
│  │              ●●●●●                                              │     │
│  │            ●       ●        Desktop   82%                       │     │
│  │           ●  donut  ●       Mobile    18%                       │     │
│  │            ●       ●                                            │     │
│  │              ●●●●●                                              │     │
│  └────────────────────────────────────────────────────────────────┘     │
├──────────────────────────────────────────────────────────────────────────┤
│  ┌─────────── UTM Source · Medium · Campaign  (tabbed) ───────────┐     │
│  │  [Source | Medium | Campaign]                                   │     │
│  │  newsletter  ███████   230                                      │     │
│  │  twitter     █████     145                                      │     │
│  └────────────────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────────────────┘
```

Two-column grid (`md:grid-cols-2`) for Short Links/Referrers and Countries/Cities widgets; single-column stack on mobile. Devices and UTM widgets are full-width.

---

## Filter Bar

Sticky to the top of the scroll container. Two primary controls + active-filter chips + a locked Pro slot.

**Time-range dropdown** (right side):

| Label | Value (API `interval`) |
|---|---|
| Last 24 hours | `24h` (default) |
| Last 7 days | `7d` |
| Last 30 days | `30d` |
| Last 90 days | `90d` |
| All time | `all` |

**Filter popover** (left side, "Filter ▾"):

A `Popover` (shadcn — to be added) that opens a list of filter categories. Selecting a category opens a searchable command list (using shadcn `Command`, to be added) of available values for that dimension. Selected values become removable chips below the bar.

| Category | Source of values | Behavior |
|---|---|---|
| **Link** | Project links via existing [`useProjectLinks`](../../../frontend/hooks/useProjectLinks.ts) | Setting this sets `?linkId=<id>`. Cleared by removing the chip or clicking back. |
| **Country** | Countries widget response (passes through `groupBy=countries`) | Renders flag + country name. Sets `?country=<ISO2>`. |
| **Device** | Static enum: `desktop`, `mobile`, `tablet`, `unknown` | Sets `?device=<value>`. |

**Domain slot** (right side, locked): A non-interactive `Domain (Pro)` button with a `Crown` Phosphor icon. Tooltip on hover: "Custom domains are available on the Pro plan. Coming soon." No dropdown opens.

**Active-filter chips:** Render below the bar in a flex-wrap row. Each chip = filter label + value + close (`×`) button. Removing a chip removes that param from the URL.

---

## State Management

All filter state lives in URL search params (`useSearchParams` + `router.replace`). This makes the page **shareable / refreshable / back-button-friendly** for free.

URL contract (mirrors the backend query params):

```
/dashboard/acme/analytics
  ?interval=7d
  &linkId=01H...
  &country=US
  &device=mobile
```

Defaults when params are absent: `interval=24h`, no other filters. The page reads these params once at the top, builds a `filters` object, and passes it to every widget hook.

---

## Data Fetching

One TanStack Query hook per widget. Each hook calls the same endpoint with a different `groupBy` and the shared `filters`.

```
hooks/useAnalytics.ts        — base hook: useAnalytics(projectSlug, { groupBy, ...filters })
                                returns { data, isLoading, isError } via useQuery
```

Convenience hooks (thin wrappers around `useAnalytics`):

| Hook | groupBy | Returned shape (from backend) |
|---|---|---|
| `useAnalyticsCount` | `count` | `{ clicks: number }` |
| `useAnalyticsTimeseries` | `timeseries` | `Array<{ start: string, clicks: number }>` |
| `useAnalyticsCountries` | `countries` | `Array<{ country, country_code, clicks }>` |
| `useAnalyticsCities` | `cities` | `Array<{ city, country_code, clicks }>` |
| `useAnalyticsDevices` | `devices` | `Array<{ device, clicks }>` |
| `useAnalyticsBrowsers` | `browsers` | `Array<{ browser, clicks }>` |
| `useAnalyticsOSes` | `os` | `Array<{ os, clicks }>` |
| `useAnalyticsReferers` | `referers` | `Array<{ referer, clicks }>` |
| `useAnalyticsUtmSources` | `utm_sources` | `Array<{ utm_source, clicks }>` |
| `useAnalyticsUtmMediums` | `utm_mediums` | `Array<{ utm_medium, clicks }>` |
| `useAnalyticsUtmCampaigns` | `utm_campaigns` | `Array<{ utm_campaign, clicks }>` |

Plus the existing [`useProjectLinks`](../../../frontend/hooks/useProjectLinks.ts) is reused — for resolving link IDs to slugs/short URLs/favicons when rendering the Short Links widget, and for populating the link picker in the Filter popover.

Each hook's `queryKey` includes `[projectSlug, groupBy, filters]` so any filter change invalidates and refetches every widget naturally. A 30-second `staleTime` matches the existing pattern in `useProjectLinks`.

API client lives at `frontend/lib/api/analytics.ts` — a single `fetchAnalytics(projectSlug, params)` function that wraps axios with the bearer token (same pattern as `frontend/app/actions/link.ts`).

---

## Component Inventory

### New files

```
frontend/
├── app/dashboard/[project-slug]/analytics/
│   └── page.tsx                                      # REWRITE — replaces the placeholder
├── components/analytics/
│   ├── FilterBar.tsx                                 # Sticky filter + time-range + chips
│   ├── ActiveFilterChips.tsx
│   ├── DomainProLock.tsx                             # Locked "Domain (Pro)" button + tooltip
│   ├── ClicksHeroChart.tsx                           # KPI tile + area chart (full-width)
│   ├── RichListWidget.tsx                            # Reusable: title + rows w/ progress bars
│   ├── TopLinksWidget.tsx                            # Wraps RichListWidget — renders favicons + slugs
│   ├── TopCountriesWidget.tsx                        # Wraps RichListWidget — renders flags
│   ├── TopCitiesWidget.tsx
│   ├── TopReferersWidget.tsx
│   ├── DonutTabbedWidget.tsx                         # Tabbed Devices | Browsers | OS donut chart
│   ├── UtmTabbedWidget.tsx                           # Tabbed UTM source | medium | campaign rich list
│   └── WidgetSkeleton.tsx                            # Loading shimmer
├── hooks/
│   └── useAnalytics.ts                               # Base hook + 11 convenience wrappers
├── lib/api/
│   └── analytics.ts                                  # fetchAnalytics client
└── lib/analytics/
    ├── chartConfigs.ts                               # Light/dark color palettes per series
    ├── flags.ts                                      # ISO2 → emoji flag helper
    └── intervals.ts                                  # Interval enum + label map
```

### shadcn primitives to add

The existing [`frontend/components/ui/`](../../../frontend/components/ui) has `button`, `dialog`, `dropdown-menu`, `input`, `sonner`. The analytics page needs more:

```bash
cd frontend && pnpm dlx shadcn@latest add popover command tabs tooltip skeleton card badge
```

### EvilCharts components to add

```bash
cd frontend && pnpm dlx shadcn@latest add @evilcharts/area-chart @evilcharts/pie-chart
```

(Bar chart is NOT added — top-N breakdowns use the custom `RichListWidget` instead.) Recharts is installed transitively.

---

## Widget Specs

### Clicks Hero (full width)

- Top-left: large `Clicks` label + total count from `useAnalyticsCount`
- Below: `EvilAreaChart` from `useAnalyticsTimeseries`
- X-axis: `start` (formatted by interval — hourly labels for 24h, daily for 7d/30d/90d/all)
- Y-axis: `clicks`
- `<Area variant="gradient" />` with the fuchsia accent color (light: `#c026d3`, dark: `#e879f9`)
- Skeleton: `WidgetSkeleton` while loading

### RichListWidget (reusable)

Props:
```ts
type RichListWidgetProps = {
  title: string;
  rows: Array<{
    key: string;
    label: ReactNode;          // can include icon/favicon/flag
    value: number;
    onClick?: () => void;      // for drill-down (Short Links)
  }>;
  isLoading: boolean;
  emptyText?: string;
}
```

Each row renders as:
- Left: the label (with optional icon)
- Right: the numeric value
- Background: a horizontal bar whose width = `(value / max) * 100%`, low-opacity fuchsia fill (`bg-fuchsia-100 dark:bg-fuchsia-950/40`)

Sorted desc by value (already the case from the API). Top 8 rows shown; a "View all" link expands or opens a dialog with the full list (out of scope for v1 — show top 8 only).

### TopLinksWidget

Backend does not currently expose a `groupBy=top_links` value. So this widget instead:

1. Calls [`useProjectLinks`](../../../frontend/hooks/useProjectLinks.ts) — returns links with `click_count` already
2. Sorts by `click_count` desc and renders the top 8 via `RichListWidget`

**Limitation:** those click counts are all-time, not time-range-scoped. Marked as a follow-up — backend should add a `groupBy=top_links` that respects the time-range filter. Document this caveat in the widget header ("All-time") for v1.

Each row: favicon (from `https://www.google.com/s2/favicons?domain=<host>&sz=32`) + slug. Clicking sets `?linkId=<link.id>` via `router.replace`.

### TopCountriesWidget / TopCitiesWidget / TopReferersWidget

- Straight wrappers over `RichListWidget` using `useAnalyticsCountries` / `useAnalyticsCities` / `useAnalyticsReferers`
- Countries row label: `<flag-emoji> {country}` via `frontend/lib/analytics/flags.ts` (ISO2 → emoji using regional indicator symbols)
- Cities row label: `{city}, {country_code}`
- Referers row label: `{referer}` (already includes `(direct)` for null)

### DonutTabbedWidget (Devices | Browsers | OS)

- shadcn `Tabs` with three triggers
- Each tab body renders an `EvilPieChart` with `innerRadius={60}` (donut shape), `paddingAngle={4}`, `cornerRadius={8}`
- Data wired from the respective hook (`useAnalyticsDevices` / `useAnalyticsBrowsers` / `useAnalyticsOSes`)
- Legend below the donut shows each slice name + percentage
- `ChartConfig` defined in `frontend/lib/analytics/chartConfigs.ts` with a small palette of light/dark color pairs reused across the three tabs (mapped by index, since values are dynamic per user)

### UtmTabbedWidget

- shadcn `Tabs` with three triggers: Source | Medium | Campaign
- Each tab body renders the `RichListWidget` with data from `useAnalyticsUtmSources` / `useAnalyticsUtmMediums` / `useAnalyticsUtmCampaigns`
- Empty state if the user has no UTM-tagged links yet ("No UTM data yet — add UTM parameters when creating links.")

---

## Theming

The app uses `next-themes` with `attribute='class'` ([`frontend/providers/ThemeProvider.tsx`](../../../frontend/providers/ThemeProvider.tsx)). Components consume the theme via Tailwind `dark:` utilities — no CSS variables for app colors.

EvilCharts uses its own `ChartConfig.colors.{light, dark}` mechanism — it auto-applies the correct color by reading the theme class on `<html>`. Each chart in this page imports its config from `frontend/lib/analytics/chartConfigs.ts` so all chart colors are reviewed in one place.

Base color palette for charts:

| Use | Light | Dark |
|---|---|---|
| Primary accent (clicks area chart, progress bars) | `#c026d3` (fuchsia-600) | `#e879f9` (fuchsia-400) |
| Donut slice 1 | `#3b82f6` | `#60a5fa` |
| Donut slice 2 | `#10b981` | `#34d399` |
| Donut slice 3 | `#f59e0b` | `#fbbf24` |
| Donut slice 4 | `#8b5cf6` | `#a78bfa` |
| Donut slice 5 | `#ec4899` | `#f472b6` |
| Donut slice 6+ | `#71717a` (zinc-500) | `#a1a1aa` (zinc-400) |

Donut slices map to colors by index; series with >6 entries collapse the long tail into "Other".

Widget cards: `bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5`. Match the existing `LinkCard` styling for consistency.

---

## Empty States & Errors

| Condition | Treatment |
|---|---|
| Loading | `WidgetSkeleton` per widget (shimmer matching widget height) |
| Widget returns `[]` or `clicks: 0` | Centered muted text: e.g. "No clicks yet for this period" |
| `useAnalyticsCount` returns 0 AND no links exist in project | Whole-page empty state: "Create a link to start tracking analytics" + CTA to `/dashboard/[slug]/links` |
| API 401/403 (shouldn't happen — auth is verified by layout) | Redirect to `/login` (existing app behavior) |
| API 404 (project slug invalid) | Show `not-found.tsx` |
| Other errors | Per-widget error banner: "Couldn't load — Retry" button |

---

## Out of Scope (this PRD)

- Custom date ranges (only the 5 presets in v1 — matches backend)
- Compare-to-previous-period
- Continent / region breakdowns
- A real per-link top-N breakdown that respects time-range (backend follow-up needed — see TopLinksWidget caveat)
- CSV / PDF export
- Real-time updates (no websockets / polling beyond TanStack's `staleTime`)
- Map visualization for countries
- Per-link analytics page at a dedicated route (drill-down uses the same page with `?linkId=...`)
- QR code source split
- Saved filter presets
- Public sharing of analytics
- Custom-domain filter (locked "Pro" button only)

---

## Verification

Once implemented:

1. **Page loads with defaults.** Visit `/dashboard/<slug>/analytics` — see the KPI tile, area chart, and all six rich-list / donut / UTM widgets render with 24h data. No layout shift; skeletons appear during fetch.
2. **Time range changes refetch all widgets.** Switch to "Last 7 days" — URL updates to `?interval=7d` and every widget shows new data. Refresh — page restores the same filter state.
3. **Filter chip composition.** Apply Link + Country + Device filters together — chips render, URL has all three params, every widget refetches with the combined filter. Removing one chip refetches with that param dropped.
4. **Link drill-down.** Click a row in the Short Links widget — URL becomes `?linkId=<id>`, every widget refetches scoped to that link. Browser back returns to project-wide view.
5. **Domain (Pro) lock.** Hover the Domain button — tooltip explains it's a Pro feature. Clicking does nothing.
6. **Light/dark mode.** Toggle theme — area chart, donuts, and progress bars all adapt; no hard-coded colors persist.
7. **Empty states.** Pick a 24h window for a fresh link with no clicks — every widget shows its empty message, no crash.
8. **Auth boundary.** Visit the page logged out — redirected to `/login` (same as other dashboard pages).
9. **Mobile.** Resize to <768px — widgets stack to one column; filter bar wraps cleanly.

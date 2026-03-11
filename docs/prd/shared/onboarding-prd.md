# Onboarding & Dashboard Flow — PRD

## Overview

After a user signs in (via email OTP or OAuth), they are always redirected to `/dashboard`. The dashboard home page fetches their projects server-side and applies the following routing logic:

- **0 projects** → redirect to `/onboarding`
- **1 project** → redirect directly to `/dashboard/<slug>` (their workspace)
- **2+ projects** → display workspace selection cards

The onboarding flow collects profile info (step 1) and creates the user's first project (step 2), then redirects to project workspace created `/dashboard/<slug>`.

---

## User Flows

### New user (first login)
```
Sign in → /dashboard → 0 projects → /onboarding → Step 1 → Step 2 → /dashboard → /dashboard/<slug>
```

### Returning user with one project
```
Sign in → /dashboard → 1 project → /dashboard/<slug>
```

### Returning user with multiple projects
```
Sign in → /dashboard → show workspace cards → click card → /dashboard/<slug>
```

---

## Dashboard Home — `/dashboard`

Server Component. Fetches `GET /api/v1/projects/` using the `spit_session` JWT cookie.

### Redirect logic
```
projects.length === 0  →  redirect("/onboarding")
projects.length === 1  →  redirect(`/dashboard/${projects[0].slug}`)
projects.length >= 2   →  render workspace card grid
```

### Workspace card grid
- Responsive grid: 1 col mobile, 2 col sm, 3 col lg
- Each card: dark bordered box, project name (bold), link count ("X active links")
- Click navigates to `/dashboard/<slug>`
- Hover: fuchsia border accent

---

## Dashboard Header — `DashboardLayout`

Replaces the sidebar with a top-bar layout.

### Layout
- Full-width top bar with `border-b border-zinc-800`
- **Left:** `Spit.sh` logo (link to `/dashboard`)
- **Right:** User avatar circle + name/email → click toggles dropdown
- Dropdown contains a single "Log out" button
- Content area below the header

---

## Onboarding Flow — `/onboarding`

### Trigger
Redirected here from `/dashboard` when user has 0 projects.

### Guard (on mount)
`getProjectsAction()` → if projects exist, `router.replace("/dashboard")`

---

## Step 1 — Personal Details

- Icon: `<UserCircle size={56} weight="duotone" className="text-fuchsia-500" />`
- Fields: First Name, Last Name (both required)
- `PATCH /api/v1/users/me` on submit → advance to Step 2

---

## Step 2 — New Project

- Icon: `<Folder size={56} weight="duotone" className="text-fuchsia-500" />`
- Fields: Project Name, Slug (auto-derived, lockable), Logo URL (optional)
- `POST /api/v1/projects/` on submit → redirect to `/dashboard`

---

## Auth Cookie

On successful OTP verification (`verify/page.tsx`):
1. `setUserCookie(data.user.id)` — signs a HS256 JWT `{ sub: userId }` with `BETTER_AUTH_SECRET`, stored as HTTP-only cookie `spit_session` (30-day expiry)
2. `router.push("/dashboard")`

On logout: `deleteUserCookie()` + `signOut()` → redirect to `/signin`

---

## Server Actions (`frontend/app/actions/`)

| File | Exports |
|------|---------|
| `auth.ts` | `setUserCookie(userId)`, `deleteUserCookie()`, `getSessionToken()` |
| `project.ts` | `getProjectsAction()`, `createProjectAction(data)` |
| `user.ts` | `updateProfileAction(data)` |

Server Actions read the `spit_session` cookie via `getSessionToken()` and forward the JWT as `Authorization: Bearer <token>` to FastAPI.

---

## Backend

### `ProjectResponse` schema

```python
class ProjectResponse(BaseModel):
    id: uuid.UUID
    name: str
    slug: str
    logo: Optional[str]
    created_at: datetime
    links_count: int = 0
```

### `GET /projects/` CRUD

Uses a SQL COUNT JOIN to return projects with their link counts in a single query.

---

## Error Handling

| Scenario | Handling |
|----------|----------|
| No `spit_session` cookie on dashboard page | redirect to `/signin` |
| `getProjectsAction()` throws (API error / 401) | redirect to `/onboarding` |
| Profile update API error | error toast |
| Project create — slug taken (409) | warning toast: "That slug is already taken" |
| Project create — other error | error toast |

---

## Verification Checklist

- [ ] New user signs in → lands on `/dashboard` → redirected to `/onboarding`
- [ ] Completing onboarding → redirected to `/dashboard` → redirected to `/dashboard/<slug>`
- [ ] Returning user with 1 project → skips dashboard home, lands directly on workspace
- [ ] Returning user with 2+ projects → sees workspace card grid
- [ ] Clicking a workspace card navigates to `/dashboard/<slug>`
- [ ] Top bar logo links to `/dashboard`
- [ ] User avatar/name click opens dropdown with Logout
- [ ] Logout clears `spit_session` cookie and redirects to `/signin`
- [ ] `/onboarding` guard redirects to `/dashboard` if user already has a project
- [ ] JWT cookie is HTTP-only and not accessible from client JS
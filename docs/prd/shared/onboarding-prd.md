# Onboarding Flow — PRD

## Overview

When a user registers for the first time (via email OTP or OAuth), they are redirected through a 2-step onboarding flow before reaching the dashboard. The flow collects their personal profile details and creates their first project, ensuring they have a named workspace ready to use.

**Trigger condition:** User is authenticated but `first_name` is `null`.

---

## User Flow

```
Sign up / First login
        ↓
/onboarding  →  Step 1: Personal Details  →  Step 2: New Project  →  /dashboard
```

Returning users with `first_name` set who navigate to `/onboarding` are redirected to `/dashboard`.

---

## Design

### Layout
- Full-height page with a subtle dark gradient background (`from-zinc-950 to-zinc-900`)
- Single centered card (`max-w-md`, white/zinc-900 dark, rounded-2xl, shadow-xl)
- Step progress indicator: 2 dots at the top of the card (fuchsia active, zinc inactive)
- Logo/wordmark at the very top of the page (above the card)

### Brand & Style
- **Primary accent:** `fuchsia-600`
- **Primary button:** `bg-fuchsia-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-fuchsia-700 focus:ring focus:outline-none focus:ring-offset-2 focus:ring-fuchsia-200 transition-all`
- **Ghost/back button:** `text-zinc-400 hover:text-zinc-200 transition-colors`
- **Input fields:** `w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500`
- **Icons:** Phosphor Icons (`@phosphor-icons/react`) — `weight="duotone"` for hero icons, `weight="regular"` for inline

---

## Step 1 — Personal Details

### UI
- **Hero icon:** `<UserCircle size={56} weight="duotone" className="text-fuchsia-500" />`
- **Heading:** "Welcome to Spit.sh"
- **Subheading:** "Let's set up your profile first."
- **Fields:**
  - First Name (required)
  - Last Name (required)
- **CTA:** "Continue" with `<ArrowRight />` icon (fuchsia primary button, full width)

### Validation (Yup)
```
first_name: string, required, max 20 chars
last_name:  string, required, max 25 chars
```

### On Submit
- `PATCH /api/v1/users/me` with `{ first_name, last_name }`
- On success → advance to Step 2

---

## Step 2 — New Project

### UI
- **Hero icon:** `<Folder size={56} weight="duotone" className="text-fuchsia-500" />`
- **Heading:** "Create your first project"
- **Subheading:** "Projects help you organise and share links."
- **Fields:**
  - Project Name (required, max 20 chars)
  - Slug — auto-derived from name (slugified), editable; shows `<PencilSimple />` icon button to unlock editing; prefix label shows `spit.sh/`
  - Logo URL (optional) — text input with `<ImageSquare />` icon; if a valid URL is entered, show a small circular preview beside the field
- **Buttons:**
  - "Create Project" with `<ArrowRight />` (fuchsia primary, full width)
  - "Back" text link above or below (ghost, navigates back to Step 1)

### Slug Auto-generation Rule
Derived from project name: lowercase, spaces → hyphens, strip non-alphanumeric (except hyphens), max 30 chars. Regenerated live as the user types the name unless the user has manually edited the slug field.

### Validation (Yup)
```
name: string, required, max 20 chars
slug: string, required, max 30 chars, matches /^[a-z0-9-]+$/
logo: string, optional, valid URL when present
```

### On Submit
- `POST /api/v1/projects/` with `{ name, slug, logo? }`
- On success → redirect to `/dashboard`

---

## Backend

### 1. Model Change — `be/models/base.py`

Add `image` field to `User`:

```python
image: Optional[str] = Field(default=None, nullable=True)
```

> No Alembic migration needed — dev uses SQLite with auto `create_all`.

---

### 2. Schemas

#### `be/schemas/userSchema.py` — additions

```python
class UpdateProfileRequest(BaseModel):
    first_name: str = Field(..., max_length=20)
    last_name: str = Field(..., max_length=25)
    image: Optional[str] = None

class UserProfileResponse(BaseModel):
    id: uuid.UUID
    email: str
    username: Optional[str]
    first_name: Optional[str]
    last_name: Optional[str]
    image: Optional[str]
    joined_at: datetime
```

#### `be/schemas/projectSchema.py` — new file

```python
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid

class ProjectCreate(BaseModel):
    name: str = Field(..., max_length=20)
    slug: str = Field(..., max_length=30, regex=r"^[a-z0-9-]+$")
    logo: Optional[str] = None

class ProjectResponse(BaseModel):
    id: uuid.UUID
    name: str
    slug: str
    logo: Optional[str]
    created_at: datetime
```

---

### 3. CRUD

#### `be/crud/user.py` — add `update_user_profile`

Returns `None` if the user doesn't exist — the router raises the 404. Keeps the CRUD layer free of HTTP concerns.

```python
async def update_user_profile(
    user_id: uuid.UUID,
    data: UpdateProfileRequest,
    db: AsyncSession,
) -> Optional[User]:
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().one_or_none()
    if not user:
        return None
    user.first_name = data.first_name
    user.last_name = data.last_name
    if data.image is not None:
        user.image = data.image
    await db.commit()
    await db.refresh(user)
    return user
```

#### `be/crud/project.py` — new file

Catches `IntegrityError` (slug conflict) and re-raises as `HTTPException(409)`. All other DB errors propagate naturally.

```python
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException

async def create_project(
    data: ProjectCreate,
    user_id: uuid.UUID,
    db: AsyncSession,
) -> Project:
    project = Project(name=data.name, slug=data.slug, logo=data.logo)
    db.add(project)
    try:
        await db.flush()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=409, detail="Slug already taken")
    membership = ProjectUsers(
        project_id=project.id,
        user_id=user_id,
        role=ProjectRole.Onwer,
    )
    db.add(membership)
    await db.commit()
    await db.refresh(project)
    return project
```

> Note: `IntegrityError` from a slug conflict is a data-level concern so it's acceptable to raise `HTTPException` here. The router stays thin.

---

### 4. Routers

#### `be/routers/userRouter.py` — new file

```
GET   /users/me    → get current user profile
PATCH /users/me    → update profile (first_name, last_name, image)
```

Both endpoints require auth (`Depends(get_current_user)` from `utils/jwt_auth.py`). Extract `user_id` from JWT payload `sub` field.

Response model: `UserProfileResponse`.

#### `be/routers/projectRouter.py` — new file

```
POST /projects/    → create project + owner membership
GET  /projects/    → list projects for current user
```

Both require auth. `POST` returns `ProjectResponse`. `GET` returns `List[ProjectResponse]`.

For `GET /projects/`: query `ProjectUsers` joined to `Project` where `user_id = current_user_id`.

---

### 5. Register Routers — `be/main.py`

```python
from routers import linkRouter, userRouter, projectRouter

configure_routes([linkRouter.router, userRouter.router, projectRouter.router])
```

---

## Frontend

### New Files

| Path | Purpose |
|------|---------|
| `frontend/app/onboarding/page.tsx` | Page container, manages `step` state (1 \| 2) |
| `frontend/components/onboarding/PersonalDetailsStep.tsx` | Step 1 form |
| `frontend/components/onboarding/NewProjectStep.tsx` | Step 2 form |
| `frontend/lib/queries/user.ts` | `updateProfile()`, `getProfile()` API calls |
| `frontend/lib/queries/project.ts` | `createProject()`, `getProjects()` API calls |
| `frontend/hooks/useOnboarding.ts` | Step state + submission logic |
| `frontend/hooks/useToast.ts` | Thin wrapper around sonner for typed toast notifications |

---

### Toast System

**Install:** `pnpm dlx shadcn@latest add sonner`

**`<Toaster />`** must be mounted once in the root layout (`frontend/app/layout.tsx`):

```tsx
import { Toaster } from "@/components/ui/sonner";

// inside <body>:
<Toaster position="bottom-right" richColors />
```

---

#### Hook — `frontend/hooks/useToast.ts`

```typescript
import { toast } from "sonner";

type ToastState = "success" | "warning" | "error" | "neutral";

export function useToast() {
  const showToast = (message: string, state: ToastState = "neutral") => {
    switch (state) {
      case "success":
        toast.success(message);
        break;
      case "warning":
        toast.warning(message);
        break;
      case "error":
        toast.error(message);
        break;
      case "neutral":
      default:
        toast(message);
    }
  };

  return { showToast };
}
```

**Usage anywhere in the app:**
```typescript
const { showToast } = useToast();

showToast("Profile saved.", "success");
showToast("Slug already taken.", "error");
showToast("Redirecting you to the dashboard…", "neutral");
```

**Toast states mapped to sonner:**

| State | Sonner call | Visual (richColors) |
|-------|-------------|---------------------|
| `success` | `toast.success()` | Green icon + border |
| `warning` | `toast.warning()` | Amber icon + border |
| `error` | `toast.error()` | Red icon + border |
| `neutral` | `toast()` | Default zinc styling |

---

### API Queries

#### `frontend/lib/queries/user.ts`

```typescript
import axios from "axios";
import { API_URL } from "@/lib/config/public_env";

export const updateProfile = async (
  data: { first_name: string; last_name: string; image?: string },
  token: string
) => {
  const res = await axios.patch(`${API_URL}/users/me`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getProfile = async (token: string) => {
  const res = await axios.get(`${API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
```

#### `frontend/lib/queries/project.ts`

```typescript
import axios from "axios";
import { API_URL } from "@/lib/config/public_env";

export const createProject = async (
  data: { name: string; slug: string; logo?: string },
  token: string
) => {
  const res = await axios.post(`${API_URL}/projects/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
```

---

### Hook — `frontend/hooks/useOnboarding.ts`

```typescript
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/lib/queries/user";
import { createProject } from "@/lib/queries/project";

export function useOnboarding(token: string) {
  const [step, setStep] = useState<1 | 2>(1);
  const router = useRouter();

  const submitProfile = async (values: { first_name: string; last_name: string }) => {
    await updateProfile(values, token);
    setStep(2);
  };

  const submitProject = async (values: { name: string; slug: string; logo?: string }) => {
    await createProject(values, token);
    router.push("/dashboard");
  };

  return { step, setStep, isLoading, submitProfile, submitProject };
}
```

---

### Middleware Update — `frontend/middleware.ts`

Add `/onboarding` to the list of protected routes (requires session). Then add redirect logic after the existing session check:

```typescript
// Unauthenticated users hitting /onboarding → /signin (handled by existing protected route guard)

// Authenticated users without first_name → redirect /dashboard to /onboarding
if (req.nextUrl.pathname.startsWith("/dashboard") && !session.user.firstName) {
  return NextResponse.redirect(new URL("/onboarding", req.url));
}

// Authenticated users who completed onboarding → redirect /onboarding to /dashboard
if (req.nextUrl.pathname.startsWith("/onboarding") && session.user.firstName) {
  return NextResponse.redirect(new URL("/dashboard", req.url));
}
```

> `session.user.firstName` requires `better-auth` to expose the field. If it isn't available in the session object by default, handle the redirect inside `onboarding/page.tsx` on mount: call `getProfile(token)` and `router.replace("/dashboard")` if `first_name` is already set.

---

### Onboarding Page — `frontend/app/onboarding/page.tsx`

```tsx
"use client";
import { useSession } from "@/lib/auth-client";
import { useOnboarding } from "@/hooks/useOnboarding";
import PersonalDetailsStep from "@/components/onboarding/PersonalDetailsStep";
import NewProjectStep from "@/components/onboarding/NewProjectStep";

export default function OnboardingPage() {
  const { data: session } = useSession();
  const token = session?.session?.token ?? "";
  const { step, setStep, submitProfile, submitProject } = useOnboarding(token);

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-950 to-zinc-900 flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-8 text-2xl font-bold text-white tracking-tight">
        spit<span className="text-fuchsia-500">.sh</span>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-8">
        {/* Step dots */}
        <div className="flex gap-2 justify-center mb-8">
          <span className={`h-2 w-6 rounded-full transition-all ${step === 1 ? "bg-fuchsia-500" : "bg-zinc-700"}`} />
          <span className={`h-2 w-6 rounded-full transition-all ${step === 2 ? "bg-fuchsia-500" : "bg-zinc-700"}`} />
        </div>

        {step === 1 && (
          <PersonalDetailsStep onSubmit={submitProfile} />
        )}
        {step === 2 && (
          <NewProjectStep onSubmit={submitProject} onBack={() => setStep(1)} />
        )}
      </div>
    </main>
  );
}
```

---

### Step 1 — `PersonalDetailsStep.tsx`

Key elements:
- `<UserCircle size={56} weight="duotone" className="text-fuchsia-500 mx-auto mb-4" />`
- Formik form with `first_name` and `last_name` text inputs
- Error messages displayed below each field in `text-red-400 text-xs`
- Submit button: full-width fuchsia rounded-full with `<ArrowRight />` icon

---

### Step 2 — `NewProjectStep.tsx`

Key elements:
- `<Folder size={56} weight="duotone" className="text-fuchsia-500 mx-auto mb-4" />`
- Project Name input — `onChange` auto-slugifies into the slug field unless user has manually edited slug
- Slug input — locked by default; `<PencilSimple />` button toggles editable state; slug is prefixed with `spit.sh/` as a read-only label inline
- Logo URL input — optional; if a valid URL is entered, renders `<img>` preview (32×32, rounded-full) beside the field using `<ImageSquare />` as placeholder
- "Create Project" button (fuchsia, full-width) + "Back" ghost text link
- `slugify` helper: `name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").slice(0, 30)`

---

## Error Handling

### Backend

| Scenario | HTTP Status | Response body |
|----------|-------------|---------------|
| No/invalid JWT on any `/users/me` or `/projects/` endpoint | `401 Unauthorized` | `{ "detail": "Invalid or expired token" }` |
| `user_id` from JWT does not exist in DB | `404 Not Found` | `{ "detail": "User not found" }` |
| Slug already taken (`UNIQUE` constraint violation on `Project.slug`) | `409 Conflict` | `{ "detail": "Slug already taken" }` |
| Validation failure (field too long, bad slug format) | `422 Unprocessable Entity` | Pydantic default error body |
| Unexpected DB error | `500 Internal Server Error` | `{ "detail": "Internal server error" }` |

**Implementation notes:**
- In `crud/project.py`, wrap the `db.commit()` in a `try/except IntegrityError` and re-raise as `HTTPException(409)` when the slug conflicts.
- The `update_user_profile` CRUD function raises `HTTPException(404)` directly if the user is not found — routers stay thin.
- Do not leak raw SQLAlchemy error messages to the client.

---

### Frontend

**Per-field validation errors** — Yup + Formik surfaces these inline, below each input, in `text-red-400 text-xs`. These fire on blur and on submit attempt.

**API error handling in `useOnboarding`** — uses `useToast` for all API-level feedback:

```typescript
const { showToast } = useToast();

const submitProfile = async (values) => {
  try {
    await updateProfile(values, token);
    showToast("Profile saved!", "success");
    setStep(2);
  } catch {
    showToast("Something went wrong. Please try again.", "error");
  }
};

const submitProject = async (values) => {
  try {
    await createProject(values, token);
    showToast("Project created!", "success");
    router.push("/dashboard");
  } catch (err: any) {
    if (err?.response?.status === 409) {
      showToast("That slug is already taken. Please choose another.", "warning");
    } else {
      showToast("Something went wrong. Please try again.", "error");
    }
  }
};
```

**Rule:** Per-field Yup validation errors remain inline (below each input, `text-red-400 text-xs`). Toasts are reserved for API responses and system-level events only — not field validation.

**Loading state:** Both submit handlers set `isLoading: true` on entry and `false` on exit (success or error). The CTA button shows a `<CircleNotch className="animate-spin" />` icon and is `disabled` while loading.

**Network/auth failures:** If the session token is absent when the page mounts, show `showToast("Please sign in to continue.", "warning")` then redirect to `/signin`.

---

## Testing

### Backend — `pytest` + `httpx AsyncClient`

All tests use an in-memory SQLite DB (already the dev default). Use `pytest-asyncio` for async test functions.

#### `tests/test_user_router.py`

| Test | Expectation |
|------|-------------|
| `PATCH /users/me` with valid JWT + valid body | `200` + updated `first_name`/`last_name` in response |
| `PATCH /users/me` with no Authorization header | `401` |
| `PATCH /users/me` with `first_name` exceeding 20 chars | `422` |
| `GET /users/me` with valid JWT | `200` + correct user fields |
| `GET /users/me` with invalid token | `401` |

#### `tests/test_project_router.py`

| Test | Expectation |
|------|-------------|
| `POST /projects/` with valid JWT + valid body | `200` + `ProjectResponse` with correct fields |
| `POST /projects/` duplicate slug | `409` with `"Slug already taken"` detail |
| `POST /projects/` with no auth | `401` |
| `POST /projects/` with slug containing uppercase | `422` |
| `GET /projects/` returns only projects owned by the current user | `200` + list scoped to user |

#### Test setup pattern

```python
import pytest
from httpx import AsyncClient
from jose import jwt
from main import app
from config.environment import settings

def make_token(user_id: str) -> str:
    return jwt.encode({"sub": user_id}, settings.better_auth_secret, algorithm="HS256")

@pytest.mark.asyncio
async def test_patch_users_me():
    token = make_token("test-user-uuid")
    async with AsyncClient(app=app, base_url="http://test") as client:
        res = await client.patch(
            "/api/v1/users/me",
            json={"first_name": "Ada", "last_name": "Lovelace"},
            headers={"Authorization": f"Bearer {token}"},
        )
    assert res.status_code == 200
    assert res.json()["first_name"] == "Ada"
```

---

### Frontend — manual / integration

Since the project has no automated frontend test setup, testing is manual against the running backend:

| Scenario | Steps | Expected |
|----------|-------|----------|
| New user onboarding — happy path | Sign up → visit `/onboarding` → fill Step 1 → fill Step 2 | Lands on `/dashboard` |
| Step 1 empty submit | Leave fields blank, click Continue | Inline errors appear, no API call made |
| Step 1 API failure | Kill backend, submit | Error toast shown, button re-enabled |
| Duplicate slug | Submit Step 2 with a slug that already exists | Warning toast: `"That slug is already taken"` |
| Back button | Complete Step 1, go to Step 2, click Back | Returns to Step 1, Step 1 fields retain values |
| Already onboarded | Visit `/onboarding` as user with `first_name` set | Redirected to `/dashboard` |
| Unauthenticated | Visit `/onboarding` without session | Redirected to `/signin` |
| Loading state | Submit either step with slow network | Button shows spinner, is disabled |

---

## Verification Checklist

- [ ] New user signs up → lands on `/onboarding` (not `/dashboard`)
- [ ] Step 1 form validates required fields and max lengths
- [ ] Submitting Step 1 sends `PATCH /api/v1/users/me` and advances to Step 2
- [ ] Project name typing auto-populates slug field
- [ ] Slug field is locked until pencil icon is clicked
- [ ] Logo URL preview renders when a valid image URL is entered
- [ ] Submitting Step 2 sends `POST /api/v1/projects/` and redirects to `/dashboard`
- [ ] Backend returns 401 on both endpoints without a valid JWT
- [ ] Authenticated user with `first_name` set visiting `/onboarding` → redirected to `/dashboard`
- [ ] Back button on Step 2 returns to Step 1 without resetting Step 1 data

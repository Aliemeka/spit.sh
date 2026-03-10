# spit-sh — Claude Project Rules

## Project Overview

spit-sh is a URL shortener. It has two workspaces:

- `frontend/` — Next.js 14 (App Router), TypeScript, Tailwind, shadcn/ui
- `be/` — FastAPI, SQLModel, SQLAlchemy async, PostgreSQL (dev: SQLite)

---

## Repository Structure

```
spit-sh/
├── be/                   # FastAPI backend
│   ├── config/           # App settings (environment.py, authentication.py)
│   ├── crud/             # DB read/write operations only — no business logic
│   ├── migrations/       # Alembic migrations
│   ├── models/           # SQLModel table definitions (base.py)
│   ├── routers/          # FastAPI route handlers — thin, no compute logic
│   ├── schemas/          # Pydantic request/response models
│   ├── services/         # Business logic and heavier compute (e.g. geo lookup)
│   ├── utils/            # Shared utilities (generate.py, limiter.py)
│   ├── database.py       # Async engine + get_session dependency
│   ├── main.py           # App entry point, middleware, route registration
│   └── requirements.txt
├── frontend/             # Next.js app
│   ├── app/              # App Router pages and layouts
│   ├── components/       # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── layouts/          # Shared layout components
│   ├── lib/              # Utilities and API client
│   └── providers/        # React context providers
└── docs/
    ├── CLAUDE.md         # This file
    └── prd/
        ├── frontend/     # Frontend-specific PRDs
        ├── backend/      # Backend-specific PRDs
        └── shared/       # Cross-cutting PRDs (e.g. auth-workflow-prd.md)
```

---

## Backend Rules (`be/`)

### Python version & dependencies

- Python 3.10, Pydantic **v1** (`pydantic==1.10.8`) — use `BaseSettings` from `pydantic`, not `pydantic_settings`
- All dependencies go in `requirements.txt`
- Virtual env lives at `be/env/` — never commit it

### Imports

- Always use **absolute imports** — no relative imports (e.g. `from schemas.clickSchema import ...`, never `from ..schemas.clickSchema import ...`)

### Layer responsibilities

| Layer       | Rule                                                                         |
| ----------- | ---------------------------------------------------------------------------- |
| `routers/`  | Route definitions and HTTP concerns only. No compute, no business logic.     |
| `crud/`     | Raw DB operations (select, insert, update) only. No HTTP, no business logic. |
| `services/` | Business logic and any heavier compute (geo lookups, etc.).                  |
| `schemas/`  | Pydantic models for request validation and response shaping.                 |
| `config/`   | Environment and app settings. All env vars loaded here via `BaseSettings`.   |
| `utils/`    | Stateless helpers shared across layers.                                      |

### Environment variables

- All env vars are centralised in `config/environment.py` via a `Settings(BaseSettings)` class
- Add new env vars to both `.env` and `config/environment.py`
- Never hardcode values that belong in env (URLs, secrets, domain names)

### Async patterns

- Use FastAPI `BackgroundTasks` for any work that should not block the response (e.g. click tracking, email sending)
- Run synchronous blocking calls (third-party libs, etc.) via `asyncio.get_event_loop().run_in_executor(None, fn, *args)`

### Rate limiting

- slowapi is configured in `utils/limiter.py` — always import the `limiter` instance from there
- `app.state.limiter` is set in `main.py` — do not re-create it elsewhere

### Database

- Use `AsyncSession` from SQLAlchemy; get it via `Depends(get_session)` from `database.py`
- Always call `results.scalars().all()` (not `results.all()`) to get model instances from queries

### Migrations

- Use Alembic for schema changes — never call `SQLModel.metadata.create_all` in production paths

---

## Frontend Rules (`frontend/`)

### Stack

- Next.js 14 App Router — use `app/` directory conventions
- TypeScript — strict mode, no `any` unless absolutely necessary
- Tailwind CSS for styling; shadcn/ui for component primitives except the button
- Phosphor Icons for icons (`@phosphor-icons/react`) — use these by default unless an icon is unavailable
- `pnpm` for package management — never use `npm` or `yarn`
- `axios` for API calls
- `formik` + `yup` for form handling and validation
- `better-auth` for authentication (Google, GitHub, email-OTP) — see `docs/prd/shared/auth-workflow-prd.md`

### Component conventions

- Place reusable components in `components/`
- Page-level layout wrappers go in `layouts/`
- Custom hooks go in `hooks/`
- Context providers go in `providers/`
- Shared utilities and API client setup go in `lib/`

### Authentication

- Auth is handled by `better-auth` on the frontend — config lives in `lib/auth.ts`, client helpers in `lib/auth-client.ts`
- The catch-all handler is mounted at `app/api/auth/[...all]/route.ts`
- Use `authClient.useSession()` client-side or `auth.api.getSession()` in Server Components to guard pages
- Better Auth issues a signed JWT; the backend validates it via JWKS — no separate sign-in endpoints needed on FastAPI

### API calls

- Base URL for the backend API is `http://localhost:8000/api/v1` in development
- Keep all API call logic in `lib/` — do not make raw `axios` calls inside components

---

## Docs & PRDs

- PRDs live under `docs/prd/`
  - `docs/prd/frontend/` — frontend-only PRDs
  - `docs/prd/backend/` — backend-only PRDs
  - `docs/prd/shared/` — full-stack / cross-cutting PRDs
- PRD files use kebab-case and the `-prd.md` suffix (e.g. `auth-workflow-prd.md`)

---

## General Rules

- Do not commit `.env` files or secrets
- Do not commit `be/env/` (Python venv) or `frontend/node_modules/`
- Keep routers readable — if a function is more than a few lines of logic, move it to a service
- Prefer editing existing files over creating new ones
- Do not add comments unless the logic is non-obvious

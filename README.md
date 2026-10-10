# Spit.sh ✨

**Shorter URLs with extra magic.** Spit.sh is an open-source URL shortener with click analytics, built with a Next.js frontend and a FastAPI backend.

🌐 [spit.sh](https://spit.sh)

## Features

- **Short links**: shorten any URL, with an optional custom slug (`spit.sh/launch`). Visitors can shorten a link from the homepage without an account.
- **Projects**: organise links into projects (workspaces) after signing in.
- **Tags and UTM parameters**: tag links by purpose and attach `utm_source`, `utm_medium`, `utm_campaign`, `utm_term` and `utm_content`.
- **Click analytics**: every redirect is recorded in the background with country, city, device, browser, OS, referrer and UTM values, then shown on per-project dashboards.
- **Link previews**: the create-link modal shows the destination's Open Graph title, image and description.

### On the roadmap

Custom domains, QR codes, dynamic links (different destinations by device or country), Pages (link-in-bio pages) and paid plans. See [`docs/prd/`](docs/prd/) for the specs.

## Tech stack

| Part                   | Stack                                                                                                                |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Frontend (`frontend/`) | Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui, Phosphor Icons, TanStack Query, Formik + Yup       |
| Auth                   | [Better Auth](https://www.better-auth.com/) in the Next.js app, with [Resend](https://resend.com) for one-time codes |
| Backend (`be/`)        | FastAPI, SQLModel, SQLAlchemy (async), Alembic, Pydantic v2, slowapi                                                 |
| Database               | PostgreSQL (SQLite works for quick local backend runs)                                                               |
| Geolocation            | MaxMind GeoLite2 City database via `geoip2`                                                                          |

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 20+ and [pnpm](https://pnpm.io/)
- Python 3.12 and [uv](https://docs.astral.sh/uv/)
- PostgreSQL
- Optional: a [MaxMind GeoLite2 City](https://dev.maxmind.com/geoip/geolite2-free-geolocation-data) `.mmdb` file for click locations. Without it, locations are recorded as `unknown`.

### 1. Clone the repository

```bash
git clone https://github.com/Aliemeka/spit.sh.git
cd spit.sh
```

### 2. Backend

```bash
cd be
uv sync
```

Create `be/.env`:

| Variable             | Description                                               |
| -------------------- | --------------------------------------------------------- |
| `DATABASE_URL`       | Async database URL. Defaults to a local SQLite file.      |
| `BETTER_AUTH_SECRET` | Must match the frontend's `BETTER_AUTH_SECRET`.           |
| `ROOT_DOMAIN`        | Base URL for short links. Defaults to `https://spit.sh/`. |
| `GEOIP_DB_PATH`      | Path to the GeoLite2 City `.mmdb` file (optional).        |

Run the migrations and start the API:

```bash
uv run alembic upgrade head
uv run uvicorn main:app --reload
```

The API runs at `http://localhost:8000/api/v1`, with interactive docs at `http://localhost:8000/docs`.

### 3. Frontend

```bash
cd frontend
pnpm install
```

Create `frontend/.env`:

| Variable                                   | Description                                                  |
| ------------------------------------------ | ------------------------------------------------------------ |
| `NEXT_PUBLIC_API_URL`                      | Backend API URL. Defaults to `http://localhost:8000/api/v1`. |
| `DATABASE_URL`                             | PostgreSQL connection string Better Auth uses.               |
| `BETTER_AUTH_SECRET`                       | A long random string. Must match the backend's.              |
| `BETTER_AUTH_URL`                          | The app's URL, e.g. `http://localhost:3001`.                 |
| `NEXT_PUBLIC_BETTER_AUTH_URL`              | Same as `BETTER_AUTH_URL`.                                   |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google OAuth credentials.                                    |
| `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` | GitHub OAuth credentials.                                    |
| `RESEND_API_KEY`                           | Resend API key for sending sign-in codes.                    |

Create Better Auth's tables (sessions, accounts and verification codes), then start the app:

```bash
pnpm dlx @better-auth/cli migrate
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001).

## Running the backend with Docker

`be/docker-compose.yml` builds the API image, runs the migrations and serves it on port `8555`. It reads `DATABASE_URL`, `BETTER_AUTH_SECRET`, `ROOT_DOMAIN` and `GEOIP_DB_PATH` from your environment, and mounts `GEOIP_HOST_DIR` (default `./data`) at `/app/data` for the GeoIP database.

```bash
cd be
docker compose up --build
```

## Contributing

Issues and pull requests are welcome. Please read [`docs/CLAUDE.md`](docs/CLAUDE.md) for the project's conventions (layer responsibilities, imports, package managers) before opening a pull request.

## License

Spit.sh is licensed under the [GNU Affero General Public License v3.0](LICENSE) (AGPL-3.0).

You can use, modify and self-host Spit.sh freely. If you run a modified version as a network service, you must make your modified source code available to its users under the same license.

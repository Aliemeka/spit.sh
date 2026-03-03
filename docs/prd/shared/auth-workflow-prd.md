# Better Auth Full-Stack Authentication Workflow

This document describes how **frontend (Next.js)** and **backend (FastAPI)** collaborate to provide authentication with **Google**, **GitHub**, and **password-less email (OTP)**. The repo already contains FastAPI email-OTP endpoints (`be/routers/authRouter.py`). We will enhance them and connect everything via JWTs.

---

## 1. Install deps with pnpm (frontend)

Run once inside `frontend/`:
```bash
pnpm add better-auth
```

Better Auth is a single package — Next.js support and TypeScript types are bundled. No separate adapter or `@types` package is needed.

## 2. Add OAuth secrets to env files

```
# .env.local  (frontend)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
BETTER_AUTH_SECRET=...                      # used to sign JWTs
BETTER_AUTH_URL=http://localhost:3001       # Next.js dev server base URL
```

FastAPI verifies JWTs via JWKS — it does not share the secret.

## 3. Frontend Better Auth config

Create `lib/auth.ts`:
```ts
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  emailAndPassword: { enabled: true },
});
```

Mount the catch-all handler at `frontend/app/api/auth/[...all]/route.ts`:
```ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

Better Auth issues a signed JWT (`accessToken`) that the client can pass to FastAPI.

## 4. Frontend helpers

Create `lib/auth-client.ts` for client-side usage:
```ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
});

export const { signIn, signOut, useSession } = authClient;
```

Wrap `SessionProvider` (if needed) in `root layout.tsx` so `useSession()` works everywhere.

## 5. FastAPI backend changes

Better Auth is a TypeScript-only library — there is no Python package. The backend validates JWTs using the public keys exposed via Better Auth's JWKS endpoint.

Install dependencies:
```bash
# inside be/
pip install "python-jose[cryptography]" httpx
```

Create `be/utils/jwt_auth.py`:
```python
import httpx
from jose import jwt, JWTError
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

JWKS_URL = "http://localhost:3001/api/auth/jwks"  # swap for prod URL

bearer_scheme = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
):
    token = credentials.credentials
    try:
        async with httpx.AsyncClient() as client:
            jwks = (await client.get(JWKS_URL)).json()
        payload = jwt.decode(token, jwks, algorithms=["RS256"])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
```

> **Note:** Cache the JWKS response in production (e.g. with `cachetools`) and refresh only when the `kid` in the JWT header is not found in the cache.

## 6. Protecting FastAPI endpoints

```python
from fastapi import Depends, APIRouter
from utils.jwt_auth import get_current_user

router = APIRouter(prefix="/links")

@router.get("/")
async def list_links(user=Depends(get_current_user)):
    return {"owner": user["sub"], "links": []}
```

## 7. Shared auth flow

1. All providers (**Google, GitHub, Email-OTP**) are configured solely in `lib/auth.ts` on the frontend. Better Auth issues a signed JWT whose signature can be validated via JWKS.
2. The browser stores the JWT (cookie or memory) and the frontend attaches it to API requests:
   ```ts
   const session = await authClient.getSession();
   axios.get("/api/v1/links", {
     headers: { Authorization: `Bearer ${session.data?.session.token}` },
   });
   ```
3. FastAPI, via `get_current_user`, verifies the JWT against the JWKS. No additional sign-in or OTP endpoints are needed on the backend.

## 8. Protecting resources

- **Backend**: Use `Depends(get_current_user)` on any route that requires authentication.
- **Frontend**: Use `authClient.useSession()` client-side, or `auth.api.getSession()` server-side in Server Components, to guard pages and layouts.

## 9. Production checklist

- Set real OAuth & SMTP credentials.
- Use HTTPS so cookies are marked `Secure`.
- Set `BETTER_AUTH_URL` to your production domain.
- Cache JWKS responses on the backend and refresh when a new `kid` is encountered.
- JWKS keys rotate automatically; never hard-code public keys.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { API_URL } from "@/lib/config/public_env";
import {
  confirmUserSession,
  confirmJWTSession,
  getJWTSubject,
  deleteSessionCookies,
} from "./lib/auth-check";
import { marketingRoutes } from "./lib/constants/routes";
import {
  workspaceCookieName,
  workspaceCookieOptions,
} from "./lib/constants/cookies";

const marketingLinks = Object.values(marketingRoutes);

const fetchSlug = async (
  slug: string,
  forwardHeaders: HeadersInit,
  retryTimes = 3,
) => {
  const response = await fetch(`${API_URL}/links/${slug}`, {
    method: "GET",
    headers: forwardHeaders,
  });
  if (!response.ok) {
    if (response.status < 500 || retryTimes <= 0) {
      return null;
    }
    return fetchSlug(slug, forwardHeaders, retryTimes - 1);
  }
  const data = await response.json();
  return data.url as string;
};

export async function middleware(request: NextRequest) {
  const slug = request.nextUrl.pathname.slice(1);

  // Protect dashboard, workspaces and onboarding — redirect to sign-in if no session cookie
  if (
    slug.startsWith("dashboard") ||
    slug.startsWith("workspaces") ||
    slug.startsWith("onboarding")
  ) {
    const [sessionValid, userId] = await Promise.all([
      confirmUserSession(request),
      getJWTSubject(request),
    ]);
    if (!sessionValid || !userId) {
      const redirectResponse = NextResponse.redirect(
        new URL("/signin", request.url),
      );
      deleteSessionCookies(redirectResponse);
      return redirectResponse;
    }

    // ?ws=<slug> deep links (e.g. billing return URLs) pick the active workspace.
    // Membership is checked by the dashboard layout, which falls back if invalid.
    const ws = request.nextUrl.searchParams.get("ws");
    if (ws) {
      const cleanUrl = request.nextUrl.clone();
      cleanUrl.searchParams.delete("ws");
      const redirectResponse = NextResponse.redirect(cleanUrl);
      redirectResponse.cookies.set(
        workspaceCookieName(userId),
        ws,
        workspaceCookieOptions,
      );
      return redirectResponse;
    }
    return NextResponse.next();
  }

  if (request.nextUrl.pathname === "/") {
    const [sessionValid, jwtValid] = await Promise.all([
      confirmUserSession(request),
      confirmJWTSession(request),
    ]);
    if (sessionValid && jwtValid) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    const nextResponse = NextResponse.next();
    deleteSessionCookies(nextResponse);
    return nextResponse;
  }

  // Skip middleware for specific paths
  if (
    slug === "sw.js" ||
    slug.startsWith("_next") ||
    marketingLinks.includes(request.nextUrl.pathname) ||
    slug.startsWith("callback") ||
    slug.startsWith("api/")
  ) {
    return NextResponse.next();
  }

  // Allow sign-in and verify pages to pass through middleware unmodified
  if (slug.startsWith("signin") || slug.startsWith("verify")) {
    return NextResponse.next();
  }

  try {
    // Get the actual ip address of the visitor
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      request.headers.get("x-real-ip") ??
      "";
    const url = await fetchSlug(slug, {
      "x-forwarded-for": ip,
      "x-real-ip": ip,
      "user-agent": request.headers.get("user-agent") ?? "",
    });

    if (!url) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL(url, request.url));
  } catch (error) {
    return NextResponse.next();
  }
}

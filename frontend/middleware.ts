import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { API_URL } from "@/lib/config/public_env";
import {
  confirmUserSession,
  confirmJWTSession,
  deleteSessionCookies,
} from "./lib/auth-check";
import { marketingRoutes } from "./lib/constants/routes";

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
    if (retryTimes <= 0) {
      return null;
    }
    return fetchSlug(slug, forwardHeaders, retryTimes - 1);
  }
  const data = await response.json();
  return data.url as string;
};

export async function middleware(request: NextRequest) {
  const slug = request.nextUrl.pathname.slice(1);

  // Protect dashboard and onboarding — redirect to sign-in if no session cookie
  if (slug.startsWith("dashboard") || slug.startsWith("onboarding")) {
    const [sessionValid, jwtValid] = await Promise.all([
      confirmUserSession(request),
      confirmJWTSession(request),
    ]);
    if (!sessionValid || !jwtValid) {
      const redirectResponse = NextResponse.redirect(
        new URL("/signin", request.url),
      );
      deleteSessionCookies(redirectResponse);
      return redirectResponse;
    }
    return NextResponse.next();
  }

  // Skip middleware for specific paths
  if (
    slug === "" ||
    slug === "sw.js" ||
    slug.startsWith("_next") ||
    marketingLinks.includes(slug) ||
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
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      request.ip ??
      "";
    const url = await fetchSlug(slug, {
      "x-forwarded-for": ip,
      "x-real-ip": ip,
      "user-agent": request.headers.get("user-agent") ?? "",
      // Vercel populates these on the edge — pass them through if present
      "x-vercel-ip-country": request.headers.get("x-vercel-ip-country") ?? "",
      "x-vercel-ip-city": request.headers.get("x-vercel-ip-city") ?? "",
      "x-vercel-ip-country-region":
        request.headers.get("x-vercel-ip-country-region") ?? "",
    });

    if (!url) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL(url, request.url));
  } catch (error) {
    return NextResponse.next();
  }
}

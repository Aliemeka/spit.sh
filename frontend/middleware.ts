import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { API_URL } from "@/lib/config/public_env";

const fetchSlug = async (slug: string, retryTimes = 3) => {
  const response = await fetch(`${API_URL}/links/${slug}`, { method: "GET" });
  if (!response.ok) {
    if (retryTimes <= 0) {
      return null;
    }
    return fetchSlug(slug, retryTimes - 1);
  }
  const data = await response.json();
  return data.url as string;
};

const getSessionCookie = (request: NextRequest) => {
  const isLocalhost = (process.env.BETTER_AUTH_URL || "").startsWith(
    "http://localhost",
  );
  const cookieName = isLocalhost
    ? "better-auth.session_token"
    : "__Secure-better-auth.session_token";
  return request.cookies.get(cookieName);
};

export async function middleware(request: NextRequest) {
  const slug = request.nextUrl.pathname.slice(1);

  // Protect dashboard and onboarding — redirect to sign-in if no session cookie
  if (slug.startsWith("dashboard") || slug.startsWith("onboarding")) {
    const sessionCookie = getSessionCookie(request);
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
    return NextResponse.next();
  }

  // Skip middleware for specific paths
  if (
    slug === "" ||
    slug === "sw.js" ||
    slug.startsWith("_next") ||
    slug.startsWith("api/")
  ) {
    return NextResponse.next();
  }

  // Redirect to dashboard if user is already signed in and tries to access sign-in or verify pages
  if (slug.startsWith("signin") || slug.startsWith("verify") || slug.startsWith("callback")) {
    return NextResponse.next();
  }

  try {
    const url = await fetchSlug(slug);

    if (!url) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL(url));
  } catch (error) {
    return NextResponse.next();
  }
}

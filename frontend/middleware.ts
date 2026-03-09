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

export async function middleware(request: NextRequest) {
  const slug = request.nextUrl.pathname.slice(1);

  // Protect dashboard — redirect to sign-in if no session cookie
  if (slug.startsWith("dashboard")) {
    const sessionCookie = request.cookies.get("better-auth.session_token");
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
    slug.startsWith("api/") ||
    slug.startsWith("signin") ||
    slug.startsWith("verify")
  ) {
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

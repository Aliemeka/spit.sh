import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { API_URL } from "@/lib/config/environment";

export async function middleware(request: NextRequest) {
  const slug = request.nextUrl.pathname.slice(1);

  // Skip middleware for specific paths
  if (
    slug === "" ||
    slug === "sw.js" ||
    slug.startsWith("_next") ||
    slug.startsWith("api/") ||
    slug.startsWith("signin") ||
    slug.startsWith("dashboard")
  ) {
    return NextResponse.next();
  }

  try {
    const response = await fetch(`${API_URL}/links/${slug}`, { method: "GET" });

    if (!response.ok) {
      return NextResponse.next();
    }

    const data = await response.json();
    return NextResponse.redirect(new URL(data.url));
  } catch (error) {
    return NextResponse.next();
  }
}

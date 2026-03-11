import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import { auth } from "@/lib/auth";
import { BETTER_AUTH_SECRET } from "@/lib/config/environment";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  const secret = new TextEncoder().encode(BETTER_AUTH_SECRET);
  const token = await new SignJWT({ sub: session.user.id })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);

  const response = NextResponse.redirect(new URL("/dashboard", request.url));
  response.cookies.set("spit_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}

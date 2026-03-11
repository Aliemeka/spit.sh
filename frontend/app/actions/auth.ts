"use server";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { BETTER_AUTH_SECRET } from "@/lib/config/environment";

const COOKIE_NAME = "spit_session";
const secret = new TextEncoder().encode(BETTER_AUTH_SECRET);

export async function setUserCookie(userId: string) {
  const token = await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function deleteUserCookie() {
  cookies().delete(COOKIE_NAME);
}

export async function getSessionToken(): Promise<string | null> {
  const cookie = cookies().get(COOKIE_NAME);
  if (!cookie) return null;
  try {
    await jwtVerify(cookie.value, secret);
    return cookie.value;
  } catch {
    return null;
  }
}

"use server";

import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { BETTER_AUTH_SECRET } from "./config/environment";

const isLocalhost = (process.env.BETTER_AUTH_URL || "").startsWith(
  "http://localhost",
);
const cookieName = isLocalhost
  ? "better-auth.session_token"
  : "__Secure-better-auth.session_token";

const secret = new TextEncoder().encode(BETTER_AUTH_SECRET);

const getSessionCookie = (request: NextRequest) => {
  return request.cookies.get(cookieName);
};

export const confirmUserSession = (request: NextRequest) => {
  const sessionToken = getSessionCookie(request)?.value;
  return !!sessionToken;
};

export const confirmJWTSession = async (request: NextRequest) => {
  const sessionToken = request.cookies.get("spit_session")?.value;
  if (!sessionToken) return false;
  try {
    jwtVerify(sessionToken, secret);
    return true;
  } catch (error) {
    return false;
  }
};

export const deleteSessionCookies = (response: NextResponse) => {
  response.cookies.delete(cookieName);
  response.cookies.delete("spit_session");
};

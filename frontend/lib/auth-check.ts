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

const jwt_cookie_name = "spit_session";

const getSessionCookie = (request: NextRequest) => {
  return request.cookies.get(cookieName);
};

export const confirmUserSession = (request: NextRequest) => {
  const sessionToken = getSessionCookie(request)?.value;
  return !!sessionToken;
};

export const getJWTSubject = async (
  request: NextRequest,
): Promise<string | null> => {
  const sessionToken = request.cookies.get(jwt_cookie_name)?.value;
  if (!sessionToken) return null;
  try {
    const { payload } = await jwtVerify(sessionToken, secret);
    return payload.sub ?? null;
  } catch (error) {
    return null;
  }
};

export const confirmJWTSession = async (request: NextRequest) =>
  (await getJWTSubject(request)) !== null;

export const deleteSessionCookies = (response: NextResponse) => {
  response.cookies.delete(cookieName);
  response.cookies.delete(jwt_cookie_name);
};

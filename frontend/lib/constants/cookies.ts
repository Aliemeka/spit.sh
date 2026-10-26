// Keyed by user id so each account on a shared browser keeps its own workspace
export const workspaceCookieName = (userId: string) => `spit_ws.${userId}`;

// Readable client-side so other tabs can notice a workspace switch
export const workspaceCookieOptions = {
  httpOnly: false,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
} as const;

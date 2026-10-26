// Keyed by user id so each account on a shared browser keeps its own workspace
export const workspaceCookieName = (userId: string) => `spit_ws.${userId}`;

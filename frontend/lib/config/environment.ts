const getEnv = (name: string, options?: { optional?: boolean }): string => {
  const value = process.env[name];
  if (!value) {
    if (options?.optional) {
      return "";
    }
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

// Better Auth
export const BETTER_AUTH_URL = getEnv("BETTER_AUTH_URL");
export const BETTER_AUTH_SECRET = getEnv("BETTER_AUTH_SECRET");

// Database
export const DATABASE_URL = getEnv("DATABASE_URL");

// OAuth
export const GOOGLE_CLIENT_ID = getEnv("GOOGLE_CLIENT_ID");
export const GOOGLE_CLIENT_SECRET = getEnv("GOOGLE_CLIENT_SECRET");
export const GITHUB_CLIENT_ID = getEnv("GITHUB_CLIENT_ID");
export const GITHUB_CLIENT_SECRET = getEnv("GITHUB_CLIENT_SECRET");

// Email
export const RESEND_API_KEY = getEnv("RESEND_API_KEY");

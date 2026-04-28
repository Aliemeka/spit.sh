import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";
import { NEXT_PUBLIC_BETTER_AUTH_URL } from "@/lib/config/public_env";

const baseURL = NEXT_PUBLIC_BETTER_AUTH_URL;

if (!baseURL) {
  throw new Error(
    "NEXT_PUBLIC_BETTER_AUTH_URL is not set. Please configure this environment variable to use the auth client.",
  );
}

export const authClient = createAuthClient({
  baseURL,
  plugins: [emailOTPClient()],
  fetchOptions: {
    headers: {
      "X-Timezone":
        typeof window !== "undefined"
          ? Intl.DateTimeFormat().resolvedOptions().timeZone
          : "UTC",
    },
  },
});

export const { signIn, signOut, useSession } = authClient;

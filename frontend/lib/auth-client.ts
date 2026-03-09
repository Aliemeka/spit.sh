import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";
import { NEXT_PUBLIC_BETTER_AUTH_URL } from "@/lib/config/environment";

export const authClient = createAuthClient({
  baseURL: NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [emailOTPClient()],
});

export const { signIn, signOut, useSession } = authClient;

import { betterAuth } from "better-auth";
import { emailOTP, bearer } from "better-auth/plugins";
import { Pool } from "pg";
import { Resend } from "resend";
import {
  DATABASE_URL,
  BETTER_AUTH_URL,
  BETTER_AUTH_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  RESEND_API_KEY,
} from "./config/environment";
import { getLocalDate, getLocalTime } from "./utils";

const resend = new Resend(RESEND_API_KEY);

export const auth = betterAuth({
  database: new Pool({ connectionString: DATABASE_URL }),
  advanced: {
    database: {
      generateId: "uuid",
    },
  },
  baseURL: BETTER_AUTH_URL,
  secret: BETTER_AUTH_SECRET,
  plugins: [
    bearer(),
    emailOTP({
      async sendVerificationOTP({ email, otp }, ctx) {
        const tz = ctx?.headers?.get("x-timezone") || "UTC";
        const localTime = getLocalTime(tz);
        const localDate = getLocalDate(tz);
        const { data, error } = await resend.emails.send({
          from: "Spit.sh <noreply@spit.sh>",
          to: email,
          subject: `Your sign-in code | ${localDate} - ${localTime}`,
          text: `Your one-time sign-in code is: ${otp}\n\nThis code expires in 10 minutes.`,
        });

        if (error) {
          console.error("[auth] Failed to send OTP email:", error);
          throw new Error("Failed to send verification email");
        }

        console.log("[auth] OTP email sent:", data?.id);
      },
    }),
  ],
  socialProviders: {
    google: {
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
    },
  },
});

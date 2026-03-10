import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
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
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        const { data, error } = await resend.emails.send({
          from: "Spit.sh <noreply@spit.sh>",
          to: email,
          subject: `Your sign-in code | ${new Date().toLocaleDateString("en-GB")} - ${new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`,
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

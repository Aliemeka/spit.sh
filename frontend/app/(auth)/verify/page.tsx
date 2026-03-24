"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthLayout from "@/layouts/AuthLayout";
import Link from "next/link";
import { authClient, useSession } from "@/lib/auth-client";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { setUserCookie } from "@/app/actions/auth";
import {
  authRoutes,
  dashboardRoutes,
  marketingRoutes,
} from "@/lib/constants/routes";

function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [resendMessage, setResendMessage] = useState("");

  const { data: session } = useSession();

  const verify = async (code: string) => {
    setIsVerifying(true);
    setError("");

    const { data, error } = await authClient.signIn.emailOtp({
      email,
      otp: code,
    });

    setIsVerifying(false);

    if (error) {
      setError(error.message ?? "Invalid code. Please try again.");
      return;
    }

    const userId = data?.user?.id;
    if (userId) {
      await setUserCookie(userId);
    }

    router.push(dashboardRoutes.home);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    await verify(otp);
  };

  const handleOtpChange = (value: string) => {
    setOtp(value);
    setError("");
    if (value.length === 6) verify(value);
  };

  const handleResend = async () => {
    setIsResending(true);
    setResendMessage("");
    setError("");

    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "sign-in",
    });

    setIsResending(false);

    if (error) {
      setError(error.message ?? "Failed to resend code.");
      return;
    }

    setResendMessage("A new code has been sent to your email.");
  };

  if (session) {
    router.push(dashboardRoutes.home);
    return null;
  }

  return (
    <AuthLayout>
      <main className='w-full h-screen flex flex-col items-center justify-center px-4 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200'>
        <div className='max-w-sm w-full space-y-8'>
          <div className='text-center'>
            <Link
              href={marketingRoutes.home}
              className='text-fuchsia-600 dark:text-fuchsia-500 font-bold inline-block text-3xl md:text-4xl'
            >
              Spit.sh ✨
            </Link>
            <div className='mt-5 space-y-2'>
              <h3 className='text-2xl font-bold'>Check your email</h3>
              <p className='text-sm text-zinc-500 dark:text-zinc-400'>
                We sent a 6-digit code to <strong>{email}</strong>
              </p>
            </div>
          </div>

          <form onSubmit={handleVerify}>
            <div className='flex flex-col items-center gap-3'>
              <label className='font-medium'>One-time code</label>
              <InputOTP
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS}
                value={otp}
                onChange={handleOtpChange}
                disabled={isVerifying}
                inputMode='numeric'
                autoFocus
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} aria-invalid={!!error} autoFocus />
                  <InputOTPSlot index={1} aria-invalid={!!error} />
                  <InputOTPSlot index={2} aria-invalid={!!error} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} aria-invalid={!!error} />
                  <InputOTPSlot index={4} aria-invalid={!!error} />
                  <InputOTPSlot index={5} aria-invalid={!!error} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            {error && (
              <p className='mt-2 text-sm text-red-500 text-center'>{error}</p>
            )}
            {resendMessage && (
              <p className='mt-2 text-sm text-green-500'>{resendMessage}</p>
            )}
            <button
              type='submit'
              disabled={isVerifying || otp.length < 6}
              className='w-full mt-4 px-4 py-2 text-white font-medium bg-fuchsia-600 focus:ring active:bg-fuchsia-500 rounded-lg duration-150 disabled:opacity-60 disabled:cursor-not-allowed'
            >
              {isVerifying ? "Verifying..." : "Verify"}
            </button>
          </form>

          <p className='text-center text-sm text-zinc-500 dark:text-zinc-400'>
            Didn&apos;t receive a code?{" "}
            <button
              onClick={handleResend}
              disabled={isResending}
              className='text-fuchsia-600 dark:text-fuchsia-500 font-medium hover:underline disabled:opacity-60'
            >
              {isResending ? "Sending..." : "Resend"}
            </button>
          </p>

          <p className='text-center text-sm text-zinc-500 dark:text-zinc-400'>
            Wrong email?{" "}
            <Link
              href={authRoutes.signIn}
              className='text-fuchsia-600 dark:text-fuchsia-500 font-medium hover:underline'
            >
              Go back
            </Link>
          </p>
        </div>
      </main>
    </AuthLayout>
  );
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyForm />
    </Suspense>
  );
}

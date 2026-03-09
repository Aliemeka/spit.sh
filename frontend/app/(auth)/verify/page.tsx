"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthLayout from "@/layouts/AuthLayout";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [resendMessage, setResendMessage] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError("");

    const { error } = await authClient.signIn.emailOtp({ email, otp });

    setIsVerifying(false);

    if (error) {
      setError(error.message ?? "Invalid code. Please try again.");
      return;
    }

    router.push("/dashboard");
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

  return (
    <AuthLayout>
      <main className='w-full h-screen dot-overlay flex flex-col items-center justify-center px-4 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200'>
        <div className='max-w-sm w-full space-y-8'>
          <div className='text-center'>
            <Link
              href='/'
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
            <div>
              <label className='font-medium'>One-time code</label>
              <input
                type='text'
                inputMode='numeric'
                pattern='[0-9]*'
                maxLength={6}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder='000000'
                className='w-full mt-2 px-3 py-2 tracking-widest text-center text-lg dark:bg-gray-800 dark:text-white bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg focus:ring-offset-2 focus:ring-offset-transparent focus:ring-1 focus:ring-fuchsia-200 focus:shadow-lg focus:shadow-fuchsia-400/50'
              />
            </div>
            {error && <p className='mt-2 text-sm text-red-500'>{error}</p>}
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
              href='/signin'
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

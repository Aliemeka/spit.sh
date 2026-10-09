"use client";
import { useSession } from "@/lib/auth-client";
import { authRoutes, dashboardRoutes } from "@/lib/constants/routes";
import Link from "next/link";
import React, { ReactNode } from "react";

interface AuthCtaProps {
  className?: string;
  label?: string;
  icon?: ReactNode;
}

const AuthCta = ({
  className,
  label = "Get started for free",
  icon,
}: AuthCtaProps) => {
  const { data: session } = useSession();
  return (
    <Link
      href={session ? dashboardRoutes.home : authRoutes.signIn}
      className={className}
    >
      {session ? "Go to dashboard" : label}
      {icon}
    </Link>
  );
};

export const SignInLink = ({ className }: { className?: string }) => {
  const { data: session } = useSession();
  if (session) return null;
  return (
    <Link href={authRoutes.signIn} className={className}>
      Sign in
    </Link>
  );
};

export default AuthCta;

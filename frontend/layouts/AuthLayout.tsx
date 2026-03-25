"use client";
import { useSession } from "@/lib/auth-client";
import { dashboardRoutes } from "@/lib/constants/routes";
import { useRouter } from "next/navigation";
import React, { FC, PropsWithChildren, useEffect } from "react";

const AuthLayout: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const { data: session } = useSession();
  useEffect(() => {
    if (session) {
      router.push(dashboardRoutes.home);
    }
  }, [session, router]);
  return <>{children}</>;
};

export default AuthLayout;

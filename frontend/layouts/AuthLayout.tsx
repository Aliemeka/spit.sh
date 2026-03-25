"use client";
import { useSession } from "@/lib/auth-client";
import { dashboardRoutes } from "@/lib/constants/routes";
import { useRouter } from "next/navigation";
import React, { FC, PropsWithChildren } from "react";

const AuthLayout: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const { data: session } = useSession();
  if (session?.user) {
    router.push(dashboardRoutes.home);
  }
  return <>{children}</>;
};

export default AuthLayout;

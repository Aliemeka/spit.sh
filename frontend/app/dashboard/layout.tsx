import React from "react";
import { Metadata } from "next/types";
import { redirect } from "next/navigation";
import DashboardLayout from "@/layouts/DashboardLayout";
import QueryProvider from "@/providers/QueryProvider";
import { UpgradeModalProvider } from "@/providers/UpgradeModalProvider";
import { WorkspaceProvider } from "@/providers/WorkspaceProvider";
import { getActiveWorkspace, getSessionUserId } from "@/lib/workspace";
import { authRoutes } from "@/lib/constants/routes";

export const metadata: Metadata = {
  title: "Spit.sh - Dashboard",
  description: "Get more out of your links with analytics and tracking",
};

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const userId = await getSessionUserId();
  if (!userId) redirect(authRoutes.signIn);
  const workspace = await getActiveWorkspace();

  return (
    <QueryProvider>
      <WorkspaceProvider slug={workspace.slug} userId={userId}>
        <UpgradeModalProvider>
          <main className='flex h-dvh bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200 relative'>
            <DashboardLayout>{children}</DashboardLayout>
          </main>
        </UpgradeModalProvider>
      </WorkspaceProvider>
    </QueryProvider>
  );
};

export default Layout;

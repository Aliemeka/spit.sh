import { redirect } from "next/navigation";
import DashboardLayout from "@/layouts/DashboardLayout";
import QueryProvider from "@/providers/QueryProvider";
import { UpgradeModalProvider } from "@/providers/UpgradeModalProvider";
import { WorkspaceProvider } from "@/providers/WorkspaceProvider";
import { getSessionUserId } from "@/lib/workspace";
import { authRoutes } from "@/lib/constants/routes";

export default async function DashLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ "project-slug": string }>;
}) {
  const { "project-slug": workspaceSlug } = await params;
  const userId = await getSessionUserId();
  if (!userId) redirect(authRoutes.signIn);

  return (
    <QueryProvider>
      <WorkspaceProvider slug={workspaceSlug} userId={userId}>
        <UpgradeModalProvider>
          <main className='flex h-dvh bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200 relative'>
            <DashboardLayout>{children}</DashboardLayout>
          </main>
        </UpgradeModalProvider>
      </WorkspaceProvider>
    </QueryProvider>
  );
}

import DashboardContainer from "@/layouts/DashboardContainer";
import QueryProvider from "@/providers/QueryProvider";
import { UpgradeModalProvider } from "@/providers/UpgradeModalProvider";

export default async function DashLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ "project-slug": string }>;
}) {
  const { "project-slug": workspaceSlug } = await params;

  return (
    <QueryProvider>
      <UpgradeModalProvider projectSlug={workspaceSlug}>
        <main className='flex h-dvh bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200 relative'>
          <DashboardContainer workspaceSlug={workspaceSlug}>
            {children}
          </DashboardContainer>
        </main>
      </UpgradeModalProvider>
    </QueryProvider>
  );
}

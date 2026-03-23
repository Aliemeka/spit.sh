import DashboardContainer from "@/components/blocks/DashboardContainer";

export default async function DashLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { "project-slug": string };
}) {
  const { "project-slug": workspaceSlug } = params;

  return (
    <main className='flex h-screen bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200 relative'>
      <DashboardContainer workspaceSlug={workspaceSlug}>
        {children}
      </DashboardContainer>
    </main>
  );
}

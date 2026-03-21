import DashboardSidebar from "@/components/blocks/DashboardSidebar";
import QueryProvider from "@/providers/QueryProvider";
import type { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Spit.sh - Dashboard",
  description: "Get more out of your links with analytics and tracking",
};

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
      <DashboardSidebar workspaceSlug={workspaceSlug} />
      <section className='flex-1 h-screen relative'>
        <nav className='py-5 px-6 border-b bg-zinc-50 dark:bg-zinc-950 dark:border-zinc-700 flex w-full justify-between items-center relative'>
          <h1 className='text-lg font-semibold'>Dashboard</h1>
          <p className='text-xs font-medium px-3 py-1.5 border border-fuchsia-200 dark:border-fuchsia-900 text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-50 dark:bg-fuchsia-950/50 rounded-full'>
            Currently in beta
          </p>
        </nav>
        <main className='p-6 md:px-10 relative w-dvw md:w-full overflow-y-auto h-[calc(100dvh-64px)]'>
          <QueryProvider>{children}</QueryProvider>
        </main>
      </section>
    </main>
  );
}

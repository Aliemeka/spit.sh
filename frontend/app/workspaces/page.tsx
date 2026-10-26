import { Metadata } from "next/types";
import DashboardHomeNavbar from "@/components/DashboardHomeNavbar";
import WorkspaceCard from "@/components/workspaces/WorkspaceCard";
import AddWorkspaceButton from "@/components/workspaces/AddWorkspaceButton";
import { getActiveWorkspace, getProjects } from "@/lib/workspace";

export const metadata: Metadata = {
  title: "Spit.sh - Workspaces",
};

export default async function WorkspacesPage() {
  const active = await getActiveWorkspace();
  const projects = await getProjects();

  return (
    <div className='min-h-screen bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200'>
      <DashboardHomeNavbar />
      <main className='px-6 md:px-10 py-10'>
        <section aria-labelledby='workspaces-heading'>
          <header className='flex flex-wrap items-center justify-between gap-4 mb-6'>
            <h1
              id='workspaces-heading'
              className='text-2xl font-semibold text-zinc-900 dark:text-zinc-200'
            >
              Your workspaces
            </h1>
            <AddWorkspaceButton />
          </header>
          <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 list-none'>
            {projects.map((project) => (
              <li key={project.id}>
                <WorkspaceCard
                  project={project}
                  isActive={project.id === active.id}
                />
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

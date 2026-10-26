import { Metadata } from "next/types";
import DashboardHomeNavbar from "@/components/DashboardHomeNavbar";
import WorkspaceCard from "@/components/workspaces/WorkspaceCard";
import { getActiveWorkspace, getProjects } from "@/lib/workspace";

export const metadata: Metadata = {
  title: "Spit.sh - Workspaces",
};

export default async function WorkspacesPage() {
  const active = await getActiveWorkspace();
  const projects = await getProjects();

  return (
    <div className='min-h-screen bg-zinc-950 text-zinc-100'>
      <DashboardHomeNavbar />
      <main className='px-8 py-10'>
        <section aria-labelledby='workspaces-heading'>
          <h1
            id='workspaces-heading'
            className='mb-6 text-lg font-medium tracking-wide'
          >
            Your workspaces
          </h1>
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

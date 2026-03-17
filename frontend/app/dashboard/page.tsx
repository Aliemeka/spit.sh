import { redirect } from "next/navigation";
import Link from "next/link";
import { getProjectsAction } from "@/app/actions/project";
import DashboardHomeNavbar from "@/components/DashboardHomeNavbar";
import { onboardingRoutes, dashboardRoutes } from "@/lib/constants/routes";

interface Project {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  links_count: number;
}

export default async function DashboardPage() {
  let projects: Project[] = [];
  try {
    projects = await getProjectsAction();
  } catch {
    redirect(onboardingRoutes.index);
  }

  if (projects.length === 0) redirect(onboardingRoutes.index);
  if (projects.length === 1) redirect(dashboardRoutes.project(projects[0].slug));

  return (
    <div className='min-h-screen bg-zinc-950 text-zinc-100'>
      <DashboardHomeNavbar />
      <main className='px-8 py-10'>
        <section aria-labelledby='workspaces-heading'>
          <h1 id='workspaces-heading' className='sr-only'>
            Your workspaces
          </h1>
          <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 list-none'>
            {projects.map((project) => (
              <li key={project.id}>
                <Link
                  href={dashboardRoutes.project(project.slug)}
                  className='flex flex-col justify-between border border-zinc-700 rounded-xl p-6 h-44 hover:border-fuchsia-500 hover:bg-zinc-800/30 transition-all'
                >
                  <h2 className='text-base font-semibold text-zinc-100'>
                    {project.name}
                  </h2>
                  <p className='text-sm text-zinc-400'>
                    {project.links_count} active{" "}
                    {project.links_count === 1 ? "link" : "links"}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

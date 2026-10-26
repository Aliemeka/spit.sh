import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decodeJwt } from "jose";
import { getSessionToken } from "@/app/actions/auth";
import { getProjectsAction } from "@/app/actions/project";
import {
  workspaceCookieName,
  workspaceCookieOptions,
} from "@/lib/constants/cookies";
import { authRoutes, onboardingRoutes } from "@/lib/constants/routes";
import type { Project } from "@/lib/types/projectTypes";

export const getSessionUserId = cache(async (): Promise<string | null> => {
  const token = await getSessionToken();
  if (!token) return null;
  return decodeJwt(token).sub ?? null;
});

export const getProjects = cache(
  async (): Promise<Project[]> => getProjectsAction(),
);

const firstCreated = (projects: Project[]) =>
  projects.reduce((first, project) =>
    new Date(project.created_at) < new Date(first.created_at) ? project : first,
  );

export const getActiveWorkspace = cache(async (): Promise<Project> => {
  const userId = await getSessionUserId();
  if (!userId) redirect(authRoutes.signIn);

  const projects = await getProjects();
  if (projects.length === 0) redirect(onboardingRoutes.index);

  const cookieStore = await cookies();
  const savedSlug = cookieStore.get(workspaceCookieName(userId))?.value;

  return (
    projects.find((project) => project.slug === savedSlug) ??
    firstCreated(projects)
  );
});

// Only callable from Server Actions and Route Handlers
export async function setWorkspaceCookie(userId: string, slug: string) {
  const cookieStore = await cookies();
  cookieStore.set(workspaceCookieName(userId), slug, workspaceCookieOptions);
}

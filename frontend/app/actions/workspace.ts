"use server";

import { redirect } from "next/navigation";
import { createProjectAction } from "@/app/actions/project";
import {
  getProjects,
  getSessionUserId,
  setWorkspaceCookie,
} from "@/lib/workspace";
import { dashboardRoutes } from "@/lib/constants/routes";
import type { Project } from "@/lib/types/projectTypes";

export async function selectWorkspaceAction(slug: string) {
  const userId = await getSessionUserId();
  if (!userId) throw new Error("Unauthorized");

  const projects = await getProjects();
  if (!projects.some((project) => project.slug === slug)) {
    throw new Error("Workspace not found");
  }

  await setWorkspaceCookie(userId, slug);
  redirect(dashboardRoutes.home);
}

export async function createWorkspaceAction(data: {
  name: string;
  slug: string;
  logo?: string;
}): Promise<Project> {
  const userId = await getSessionUserId();
  if (!userId) throw new Error("Unauthorized");

  const project = await createProjectAction(data);
  await setWorkspaceCookie(userId, project.slug);
  return project;
}

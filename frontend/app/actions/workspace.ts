"use server";

import { redirect } from "next/navigation";
import {
  getProjects,
  getSessionUserId,
  setWorkspaceCookie,
} from "@/lib/workspace";
import { dashboardRoutes } from "@/lib/constants/routes";

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

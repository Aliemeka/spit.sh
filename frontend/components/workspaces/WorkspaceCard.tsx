"use client";

import { FC } from "react";
import { useFormStatus } from "react-dom";
import { selectWorkspaceAction } from "@/app/actions/workspace";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/types/projectTypes";

const CardButton: FC<{ project: Project; isActive: boolean }> = ({
  project,
  isActive,
}) => {
  const { pending } = useFormStatus();

  return (
    <button
      type='submit'
      disabled={pending}
      className={cn(
        "flex flex-col justify-between w-full h-44 p-6 text-left border rounded-xl bg-white dark:bg-zinc-900 transition-all hover:border-fuchsia-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 disabled:opacity-60",
        isActive
          ? "border-fuchsia-500"
          : "border-zinc-200 dark:border-zinc-800",
      )}
    >
      <span className='flex items-start justify-between gap-2'>
        <span className='text-base font-semibold text-zinc-900 dark:text-zinc-100'>
          {project.name}
        </span>
        {isActive && (
          <span className='rounded-full bg-fuchsia-600 px-2 py-0.5 text-[11px] font-semibold text-white'>
            Current
          </span>
        )}
      </span>
      <span className='text-sm text-zinc-500 dark:text-zinc-400'>
        {pending
          ? "Opening…"
          : `${project.links_count} active ${project.links_count === 1 ? "link" : "links"}`}
      </span>
    </button>
  );
};

const WorkspaceCard: FC<{ project: Project; isActive: boolean }> = ({
  project,
  isActive,
}) => (
  <form action={selectWorkspaceAction.bind(null, project.slug)}>
    <CardButton project={project} isActive={isActive} />
  </form>
);

export default WorkspaceCard;

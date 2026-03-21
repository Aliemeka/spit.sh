"use client";

import LinksList from "@/components/links/LinksList";
import { useProjectLinks } from "@/hooks/useProjectLinks";

interface Props {
  projectSlug: string;
}

const RecentLinks = ({ projectSlug }: Props) => {
  const { links, loading, refresh } = useProjectLinks(projectSlug);

  return (
    <div className="col-span-1 md:col-span-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
      <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1">
        Recent links
      </p>
      <LinksList
        links={links.slice(0, 3)}
        projectSlug={projectSlug}
        loading={loading}
        onRefresh={refresh}
      />
    </div>
  );
};

export default RecentLinks;

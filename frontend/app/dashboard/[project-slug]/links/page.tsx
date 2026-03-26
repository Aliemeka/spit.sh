"use client";

import React from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { PlusCircleIcon } from "@phosphor-icons/react";
import DashboardLayout from "@/layouts/DashboardLayout";
import EmptyState from "@/components/blocks/EmptyState";
import NewLinkModal from "@/components/links/NewLinkModal";
import LinksList from "@/components/links/LinksList";
import { useProjectLinks } from "@/hooks/useProjectLinks";

const LinkPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const projectSlug = params["project-slug"] as string;
  const showModal = searchParams.get("action") === "new_link";

  const { links, loading, refresh } = useProjectLinks(projectSlug, {
    limit: 5,
  });

  const openModal = () => {
    router.push(`?action=new_link`);
  };

  const CreateButton = (
    <button
      onClick={openModal}
      className='inline-flex items-center rounded-full bg-fuchsia-600 px-6 py-2.5 text-sm font-semibold text-white gap-x-1.5 hover:bg-fuchsia-700 focus:outline-none focus:ring active:bg-fuchsia-800 transition'
    >
      <span>Create new link</span>
      <PlusCircleIcon size={16} weight='bold' />
    </button>
  );

  return (
    <DashboardLayout title='Links' SideButton={CreateButton}>
      {loading || links.length > 0 ? (
        <LinksList
          links={links}
          projectSlug={projectSlug}
          loading={loading}
          onRefresh={refresh}
        />
      ) : (
        <EmptyState text='No links yet'>
          <button
            onClick={openModal}
            className='inline-flex items-center rounded-full bg-fuchsia-600 px-8 py-3 transition hover:rotate-6 text-sm font-semibold text-white gap-x-1 focus:outline-none focus:ring active:bg-fuchsia-800 mt-4'
          >
            <span>Create new link</span>
            <PlusCircleIcon size={16} weight='bold' />
          </button>
        </EmptyState>
      )}

      {showModal && (
        <NewLinkModal projectSlug={projectSlug} onSuccess={refresh} />
      )}
    </DashboardLayout>
  );
};

export default LinkPage;

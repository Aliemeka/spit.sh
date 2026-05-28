"use client";

import React, { useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { PlusCircleIcon } from "@phosphor-icons/react";
import DashboardLayout from "@/layouts/DashboardLayout";
import EmptyState from "@/components/blocks/EmptyState";
import NewLinkModal from "@/components/links/NewLinkModal";
import LinksList from "@/components/links/LinksList";
import { useProjectLinks } from "@/hooks/useProjectLinks";
import PrimaryButton from "@/components/ui/primary-button";
import { Kbd } from "@/components/ui/kbd";

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
    <PrimaryButton
      onClick={openModal}
      icon={
        <span className='flex items-center gap-0.5'>
          <Kbd>N</Kbd>
          <PlusCircleIcon size={16} weight='bold' />
        </span>
      }
    >
      <span>Create new link</span>
    </PrimaryButton>
  );

  useEffect(() => {
    const keyboardEventHandler = (e: KeyboardEvent) => {
      if ((e.key === "n" || e.key === "N") && !showModal) {
        e.preventDefault();
        openModal();
      }
    };

    window.addEventListener("keydown", keyboardEventHandler);

    return () => {
      window.removeEventListener("keydown", keyboardEventHandler);
    };
  }, [showModal]);

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

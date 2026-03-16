"use client";

import React from "react";
import LinkCard from "./LinkCard";
import { LinkResponse } from "@/lib/types/linkTypes";

interface Props {
  links: LinkResponse[];
  projectSlug: string;
  loading: boolean;
  onRefresh: () => void;
}

export default function LinksList({
  links,
  projectSlug,
  loading,
  onRefresh,
}: Props) {
  if (loading) {
    return (
      <div className='space-y-3 mt-4'>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className='h-20 rounded-xl bg-zinc-100 dark:bg-zinc-800 animate-pulse'
          />
        ))}
      </div>
    );
  }

  return (
    <div className='space-y-3 mt-4 lg:mt-6'>
      {links.map((link) => (
        <LinkCard
          key={link.id}
          link={link}
          projectSlug={projectSlug}
          onDeleted={onRefresh}
        />
      ))}
    </div>
  );
}

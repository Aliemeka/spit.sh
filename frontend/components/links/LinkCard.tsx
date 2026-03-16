"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ArrowsClockwiseIcon,
  CalendarBlankIcon,
  ChartBarIcon,
  CheckIcon,
  CopyIcon,
  PencilSimpleIcon,
  ShareNetworkIcon,
  TagIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { LinkResponse } from "@/lib/types/linkTypes";
import { deleteProjectLinkAction } from "@/app/actions/link";
import { useToast } from "@/hooks/useToast";

interface Props {
  link: LinkResponse;
  projectSlug: string;
  onDeleted: () => void;
}

export default function LinkCard({ link, projectSlug, onDeleted }: Props) {
  const { toastSuccess, toastError, toastNeutral } = useToast();
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const hostname = (() => {
    try {
      return new URL(link.url).hostname;
    } catch {
      return link.url;
    }
  })();

  const faviconUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;

  const formattedDate = new Date(link.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const copyShortUrl = () => {
    navigator.clipboard.writeText(link.shortenUrl);
    toastNeutral("Link copied to clipboard!");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteProjectLinkAction(projectSlug, link.id);
      toastSuccess("Link deleted");
      onDeleted();
    } catch {
      toastError("Failed to delete link");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className='px-4 py-3.5 border border-zinc-100 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 hover:border-zinc-200 dark:hover:border-zinc-700 transition'>
      {/* Top row: favicon + title + actions */}
      <div className='flex items-start gap-3'>
        <img
          src={faviconUrl}
          alt={hostname}
          width={20}
          height={20}
          className='rounded shrink-0 mt-0.5'
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />

        {/* Title + URLs */}
        <div className='flex-1 min-w-0'>
          <p className='text-sm font-semibold text-zinc-800 dark:text-zinc-100 truncate'>
            {hostname}
          </p>
          <div className='flex items-center gap-1.5 mt-0.5'>
            <a
              href={link.shortenUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='text-sm text-fuchsia-600 dark:text-fuchsia-400 font-medium hover:underline truncate'
            >
              {link.shortenUrl}
            </a>
            <button
              type='button'
              onClick={copyShortUrl}
              className='shrink-0 text-zinc-400 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition'
              title='Copy short URL'
            >
              {copied ? (
                <CheckIcon size={13} weight='bold' />
              ) : (
                <CopyIcon size={13} />
              )}
            </button>
          </div>
          <p className='text-xs text-zinc-400 dark:text-zinc-500 truncate mt-0.5'>
            ↳ {link.url}
          </p>
        </div>

        {/* Actions */}
        <div className='flex items-center gap-1 shrink-0 text-zinc-400'>
          <button
            type='button'
            className='p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200 transition'
            title='Edit'
          >
            <PencilSimpleIcon size={15} />
          </button>
          <button
            type='button'
            className='p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200 transition'
            title='Share'
          >
            <ShareNetworkIcon size={15} />
          </button>
          <button
            type='button'
            className='p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200 transition'
            title='Analytics'
          >
            <ChartBarIcon size={15} />
          </button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                type='button'
                disabled={deleting}
                className='p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 dark:hover:text-red-400 transition disabled:opacity-50'
                title='Delete'
              >
                <TrashIcon size={15} />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className='bg-white border-zinc-200 text-zinc-900 dark:bg-white dark:border-zinc-200 dark:text-zinc-900'>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete link?</AlertDialogTitle>
                <AlertDialogDescription className='text-zinc-500 dark:text-zinc-500'>
                  This will permanently delete{" "}
                  <span className='font-medium text-zinc-800 dark:text-zinc-200'>
                    {link.shortenUrl}
                  </span>{" "}
                  and all its click data. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className='bg-red-600 hover:bg-red-700 text-white'
                >
                  {deleting ? "Deleting…" : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Bottom row: metadata */}
      <div className='flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2.5 pl-8 text-xs text-zinc-500 dark:text-zinc-400'>
        <span className='flex items-center gap-1'>
          <ArrowsClockwiseIcon size={13} />
          {link.click_count} click{link.click_count !== 1 ? "s" : ""}
        </span>
        <span className='flex items-center gap-1'>
          <CalendarBlankIcon size={13} />
          {formattedDate}
        </span>
        {link.tags.length > 0 ? (
          <div className='flex items-center gap-1'>
            <TagIcon size={13} />
            <div className='flex flex-wrap gap-1'>
              {link.tags.map((tag) => (
                <span
                  key={tag}
                  className='px-1.5 py-0.5 rounded-full text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <span className='flex items-center gap-1'>
            <TagIcon size={13} />
            No tags
          </span>
        )}
      </div>
    </div>
  );
}

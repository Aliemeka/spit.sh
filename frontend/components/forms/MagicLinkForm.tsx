"use client";
import useCreateLink from "@/hooks/useCreateLink";
import { cn } from "@/lib/utils";
import {
  ArrowUpRightIcon,
  LinkSimpleIcon,
  MagicWandIcon,
} from "@phosphor-icons/react";
import { useFormik } from "formik";
import React from "react";
import * as Yup from "yup";

interface MagicLinkFormProps {
  className?: string;
  formClassName?: string;
  buttonClassName?: string;
}

const MagicLinkForm = ({
  className,
  formClassName,
  buttonClassName,
}: MagicLinkFormProps) => {
  const { creating, handleCreateLink, shortenedLink } = useCreateLink();

  const formik = useFormik({
    initialValues: { url: "" },
    validationSchema: Yup.object({
      url: Yup.string()
        .required("Please enter a url")
        .url("Please enter a valid url"),
    }),
    onSubmit: async ({ url }) => {
      await handleCreateLink(url);
    },
  });

  return (
    <div className={cn("w-full", className)}>
      <form
        onSubmit={formik.handleSubmit}
        className={cn(
          "flex items-center gap-2 border border-zinc-900/10 bg-white p-1.5 shadow-sm transition focus-within:border-fuchsia-500/50 focus-within:ring-4 focus-within:ring-fuchsia-500/10 dark:border-white/10 dark:bg-zinc-900",
          formClassName,
        )}
      >
        <LinkSimpleIcon
          size={18}
          className='ml-2 shrink-0 text-zinc-400 dark:text-zinc-500'
        />
        <label htmlFor='magic-url' className='sr-only'>
          Long URL
        </label>
        <input
          id='magic-url'
          type='text'
          inputMode='url'
          name='url'
          value={formik.values.url}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder='myfancylongwebsitename.com'
          className='min-w-0 flex-1 bg-transparent py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none dark:text-zinc-100 dark:placeholder:text-zinc-500'
        />
        <button
          type='submit'
          disabled={creating}
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 bg-fuchsia-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-fuchsia-700 disabled:opacity-60 dark:bg-fuchsia-500 dark:hover:bg-fuchsia-600",
            buttonClassName,
          )}
        >
          <MagicWandIcon size={16} weight='bold' />
          {creating ? "Casting…" : "Shorten"}
        </button>
      </form>

      {formik.touched.url && formik.errors.url ? (
        <p className='mt-2 text-left text-xs text-red-600 dark:text-red-400'>
          {formik.errors.url}
        </p>
      ) : null}

      {shortenedLink ? (
        <a
          href={shortenedLink}
          target='_blank'
          className='mt-3 flex items-center justify-between rounded-xl border border-fuchsia-500/20 bg-fuchsia-50 px-4 py-3 text-sm font-medium text-fuchsia-700 transition hover:border-fuchsia-500/50 dark:bg-fuchsia-500/10 dark:text-fuchsia-300'
        >
          <span className='truncate'>{shortenedLink}</span>
          <ArrowUpRightIcon size={16} weight='bold' className='shrink-0' />
        </a>
      ) : null}
    </div>
  );
};

export default MagicLinkForm;

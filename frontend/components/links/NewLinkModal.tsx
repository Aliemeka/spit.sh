"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  ArrowSquareOutIcon,
  CaretDownIcon,
  CaretUpIcon,
  LinkIcon,
  ShuffleIcon,
  TagIcon,
} from "@phosphor-icons/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createProjectLinkAction } from "@/app/actions/link";
import { useToast } from "@/hooks/useToast";

const TAGS = [
  "invite",
  "product-launch",
  "lead",
  "social",
  "email",
  "blog",
  "affiliate",
  "internal",
  "event",
  "promo",
  "support",
  "retargeting",
  "test",
];

interface OGData {
  title: string | null;
  description: string | null;
  image: string | null;
}

interface Props {
  projectSlug: string;
  onSuccess: () => void;
}

export default function NewLinkModal({ projectSlug, onSuccess }: Props) {
  const router = useRouter();
  const { toastSuccess, toastError } = useToast();

  const [showSlug, setShowSlug] = useState(false);
  const [showUTM, setShowUTM] = useState(false);
  const [ogData, setOGData] = useState<OGData | null>(null);
  const [ogLoading, setOGLoading] = useState(false);

  const close = () => {
    router.replace("?");
  };

  const fetchOG = useCallback(async (url: string) => {
    try {
      new URL(url);
    } catch {
      return;
    }
    setOGLoading(true);
    try {
      const res = await fetch(`/api/og-preview?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      setOGData(data);
    } catch {
      setOGData(null);
    } finally {
      setOGLoading(false);
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      url: "",
      slug: "",
      tags: [] as string[],
      utm_source: "",
      utm_medium: "",
      utm_campaign: "",
      utm_term: "",
      utm_content: "",
    },
    validationSchema: Yup.object({
      url: Yup.string()
        .url("Enter a valid URL")
        .required("Destination URL is required"),
      utm_source: showUTM
        ? Yup.string().required("UTM source is required")
        : Yup.string(),
      utm_medium: showUTM
        ? Yup.string().required("UTM medium is required")
        : Yup.string(),
      utm_campaign: showUTM
        ? Yup.string().required("UTM campaign is required")
        : Yup.string(),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await createProjectLinkAction(projectSlug, {
          url: values.url,
          slug: values.slug || undefined,
          tags: values.tags,
          utm_source: showUTM && values.utm_source ? values.utm_source : undefined,
          utm_medium: showUTM && values.utm_medium ? values.utm_medium : undefined,
          utm_campaign: showUTM && values.utm_campaign ? values.utm_campaign : undefined,
          utm_term: showUTM && values.utm_term ? values.utm_term : undefined,
          utm_content: showUTM && values.utm_content ? values.utm_content : undefined,
        });
        toastSuccess("Link created");
        onSuccess();
        close();
      } catch {
        toastError("Failed to create link");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const toggleTag = (tag: string) => {
    const current = formik.values.tags;
    formik.setFieldValue(
      "tags",
      current.includes(tag)
        ? current.filter((t) => t !== tag)
        : [...current, tag],
    );
  };

  const inputClass =
    "w-full mt-1 px-3 py-2 dark:bg-zinc-900 dark:text-white bg-transparent outline-none border border-zinc-200 dark:border-zinc-700 rounded-lg focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-300 focus:shadow-sm text-sm";
  const labelClass = "text-sm font-medium text-zinc-700 dark:text-zinc-300";

  return (
    <Dialog open onOpenChange={(open) => !open && close()}>
      <DialogContent className='max-w-4xl w-full p-0 bg-zinc-100/85 dark:bg-zinc-900/85 backdrop-blur-sm overflow-hidden'>
        <DialogHeader className='px-6 pt-5 pb-4 border-b border-zinc-300 dark:border-zinc-800'>
          <DialogTitle className='flex items-center gap-2 text-base font-semibold'>
            <LinkIcon size={18} weight='bold' />
            New link
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit}>
          <div className='grid grid-cols-1 md:grid-cols-5 min-h-[480px]'>
            {/* Left panel */}
            <div className='md:col-span-3 px-6 py-5 space-y-5 border-b border-zinc-100 dark:border-zinc-800 md:border-b-0 md:border-r overflow-y-auto'>
              {/* Destination URL */}
              <div>
                <label className={labelClass}>Destination URL</label>
                <input
                  name='url'
                  placeholder='https://example.com'
                  value={formik.values.url}
                  onChange={formik.handleChange}
                  onBlur={(e) => {
                    formik.handleBlur(e);
                    fetchOG(e.target.value);
                  }}
                  className={inputClass}
                />
                {formik.touched.url && formik.errors.url && (
                  <p className='text-xs text-red-500 mt-1'>
                    {formik.errors.url}
                  </p>
                )}
              </div>

              {/* Slug */}
              <div>
                <button
                  type='button'
                  onClick={() => setShowSlug((v) => !v)}
                  className='flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition'
                >
                  <ShuffleIcon size={14} />
                  {showSlug ? "Auto-generate slug" : "Customise slug"}
                  {showSlug ? (
                    <CaretUpIcon size={12} />
                  ) : (
                    <CaretDownIcon size={12} />
                  )}
                </button>
                {showSlug && (
                  <div className='mt-2'>
                    <input
                      name='slug'
                      placeholder='my-custom-slug'
                      value={formik.values.slug}
                      onChange={formik.handleChange}
                      className={inputClass}
                    />
                  </div>
                )}
              </div>

              {/* Tags */}
              <div>
                <label
                  className={`${labelClass} flex items-center gap-1.5 mb-2`}
                >
                  <TagIcon size={14} />
                  Tags
                </label>
                <div className='flex flex-wrap gap-2'>
                  {TAGS.map((tag) => (
                    <button
                      key={tag}
                      type='button'
                      onClick={() => toggleTag(tag)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border transition ${
                        formik.values.tags.includes(tag)
                          ? "bg-fuchsia-600 border-fuchsia-600 text-white"
                          : "bg-transparent border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-fuchsia-400 hover:text-fuchsia-600"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* UTM */}
              <div>
                <button
                  type='button'
                  onClick={() => setShowUTM((v) => !v)}
                  className='flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition'
                >
                  {showUTM ? (
                    <CaretUpIcon size={12} />
                  ) : (
                    <CaretDownIcon size={12} />
                  )}
                  {showUTM ? "Remove UTM parameters" : "Add UTM parameters"}
                </button>
                {showUTM && (
                  <div className='mt-3 space-y-3'>
                    <div className='grid grid-cols-2 gap-3'>
                      <div>
                        <label className={labelClass}>Source *</label>
                        <input
                          name='utm_source'
                          placeholder='twitter'
                          value={formik.values.utm_source}
                          onChange={formik.handleChange}
                          className={inputClass}
                        />
                        {formik.touched.utm_source &&
                          formik.errors.utm_source && (
                            <p className='text-xs text-red-500 mt-1'>
                              {formik.errors.utm_source}
                            </p>
                          )}
                      </div>
                      <div>
                        <label className={labelClass}>Medium *</label>
                        <input
                          name='utm_medium'
                          placeholder='social'
                          value={formik.values.utm_medium}
                          onChange={formik.handleChange}
                          className={inputClass}
                        />
                        {formik.touched.utm_medium &&
                          formik.errors.utm_medium && (
                            <p className='text-xs text-red-500 mt-1'>
                              {formik.errors.utm_medium}
                            </p>
                          )}
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Campaign *</label>
                      <input
                        name='utm_campaign'
                        placeholder='black_friday_2025'
                        value={formik.values.utm_campaign}
                        onChange={formik.handleChange}
                        className={inputClass}
                      />
                      {formik.touched.utm_campaign &&
                        formik.errors.utm_campaign && (
                          <p className='text-xs text-red-500 mt-1'>
                            {formik.errors.utm_campaign}
                          </p>
                        )}
                    </div>
                    <div className='grid grid-cols-2 gap-3'>
                      <div>
                        <label className={labelClass}>Term</label>
                        <input
                          name='utm_term'
                          placeholder='keyword'
                          value={formik.values.utm_term}
                          onChange={formik.handleChange}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Content</label>
                        <input
                          name='utm_content'
                          placeholder='header_cta'
                          value={formik.values.utm_content}
                          onChange={formik.handleChange}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right panel — OG preview */}
            <div className='hidden md:flex md:col-span-2 px-5 py-5 flex-col'>
              <p className={`${labelClass} mb-3`}>Preview</p>
              {ogLoading ? (
                <div className='flex-1 space-y-3'>
                  <div className='w-full h-40 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse' />
                  <div className='h-4 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse w-3/4' />
                  <div className='h-3 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse w-full' />
                  <div className='h-3 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse w-2/3' />
                </div>
              ) : ogData ? (
                <div className='border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden flex-1'>
                  {ogData.image && (
                    <img
                      src={ogData.image}
                      alt='OG preview'
                      className='w-full h-40 object-cover'
                    />
                  )}
                  <div className='p-3 space-y-1'>
                    {ogData.title && (
                      <p className='text-sm font-semibold text-zinc-800 dark:text-zinc-100 line-clamp-2'>
                        {ogData.title}
                      </p>
                    )}
                    {ogData.description && (
                      <p className='text-xs text-zinc-500 dark:text-zinc-400 line-clamp-3'>
                        {ogData.description}
                      </p>
                    )}
                    {formik.values.url && (
                      <a
                        href={formik.values.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center gap-1 text-xs text-fuchsia-600 dark:text-fuchsia-400 mt-1 hover:underline'
                      >
                        <ArrowSquareOutIcon size={12} />
                        {new URL(formik.values.url).hostname}
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className='flex-1 border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-lg flex flex-col items-center justify-center text-center p-4'>
                  <LinkIcon
                    size={28}
                    className='text-zinc-300 dark:text-zinc-600 mb-2'
                  />
                  <p className='text-xs text-zinc-400 dark:text-zinc-500'>
                    Enter a destination URL to see a preview
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className='flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-100 dark:border-zinc-800'>
            <button
              type='button'
              onClick={close}
              className='px-5 py-2 rounded-full text-sm font-medium text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 transition'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={formik.isSubmitting}
              className='px-6 py-2 rounded-full text-sm font-semibold text-white bg-fuchsia-600 hover:bg-fuchsia-700 disabled:opacity-60 transition'
            >
              {formik.isSubmitting ? "Creating…" : "Create link"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

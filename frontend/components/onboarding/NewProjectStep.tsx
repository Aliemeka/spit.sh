"use client";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import ImageSquareIcon from "../icons/ImageSquareIcon";
import { ArrowRightIcon, FolderIcon, PencilIcon } from "@phosphor-icons/react";

interface Props {
  onSubmit: (values: {
    name: string;
    slug: string;
    logo?: string;
  }) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 30);

const validationSchema = Yup.object({
  name: Yup.string()
    .required("Project name is required")
    .max(20, "Max 20 characters"),
  slug: Yup.string()
    .required("Slug is required")
    .max(30, "Max 30 characters")
    .matches(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens"),
  logo: Yup.string().url("Must be a valid URL").optional(),
});

export default function NewProjectStep({ onSubmit, onBack, isLoading }: Props) {
  const [slugEdited, setSlugEdited] = useState(false);
  const [slugLocked, setSlugLocked] = useState(true);

  const formik = useFormik({
    initialValues: { name: "", slug: "", logo: "" },
    validationSchema,
    onSubmit: ({ name, slug, logo }) =>
      onSubmit({ name, slug, logo: logo || undefined }),
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.handleChange(e);
    if (!slugEdited) {
      formik.setFieldValue("slug", slugify(e.target.value));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugEdited(true);
    formik.handleChange(e);
  };

  const isValidUrl = (val: string) => {
    try {
      new URL(val);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div>
      <FolderIcon
        size={56}
        weight='duotone'
        className='text-fuchsia-500 mx-auto mb-4'
      />
      <h1 className='text-xl font-bold text-white text-center mb-1'>
        Create your first project
      </h1>
      <p className='text-sm text-zinc-400 text-center mb-8'>
        Projects help you organise and share links.
      </p>

      <form onSubmit={formik.handleSubmit} className='flex flex-col gap-5'>
        {/* Project Name */}
        <div>
          <label className='block text-xs font-medium text-zinc-400 mb-1.5'>
            Project Name
          </label>
          <input
            name='name'
            value={formik.values.name}
            onChange={handleNameChange}
            onBlur={formik.handleBlur}
            placeholder='My Workspace'
            className='w-full rounded-xl border border-zinc-700 bg-transparent px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-500'
          />
          {formik.touched.name && formik.errors.name && (
            <p className='text-red-400 text-xs mt-1'>{formik.errors.name}</p>
          )}
        </div>

        {/* Slug */}
        <div>
          <label className='block text-xs font-medium text-zinc-400 mb-1.5'>
            Slug
          </label>
          <div className='flex items-center rounded-xl border border-zinc-700 focus-within:ring-2 focus-within:ring-fuchsia-500 overflow-hidden'>
            <span className='px-3 text-sm text-zinc-500 select-none whitespace-nowrap'>
              spit.sh/
            </span>
            <input
              name='slug'
              value={formik.values.slug}
              onChange={handleSlugChange}
              onBlur={formik.handleBlur}
              disabled={slugLocked}
              placeholder='my-workspace'
              className='flex-1 bg-transparent py-3 pr-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none disabled:text-zinc-500'
            />
            <button
              type='button'
              onClick={() => setSlugLocked((prev) => !prev)}
              className='px-3 text-zinc-500 hover:text-fuchsia-400 transition-colors'
              title={slugLocked ? "Edit slug" : "Lock slug"}
            >
              <PencilIcon
                size={16}
                weight={slugLocked ? "bold" : "duotone"}
                className={slugLocked ? "" : "text-fuchsia-400"}
              />
            </button>
          </div>
          {formik.touched.slug && formik.errors.slug && (
            <p className='text-red-400 text-xs mt-1'>{formik.errors.slug}</p>
          )}
        </div>

        {/* Logo URL */}
        <div>
          <label className='block text-xs font-medium text-zinc-400 mb-1.5'>
            Logo URL{" "}
            <span className='text-zinc-600 font-normal'>(optional)</span>
          </label>
          <div className='flex items-center gap-3'>
            <div className='relative flex-1'>
              <ImageSquareIcon
                size={16}
                className='absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500'
              />
              <input
                name='logo'
                value={formik.values.logo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder='https://example.com/logo.png'
                className='w-full rounded-xl border border-zinc-700 bg-transparent pl-9 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-500'
              />
            </div>
            {formik.values.logo && isValidUrl(formik.values.logo) ? (
              <img
                src={formik.values.logo}
                alt='logo preview'
                className='w-9 h-9 rounded-full object-cover border border-zinc-700 shrink-0'
              />
            ) : (
              <div className='w-9 h-9 rounded-full border border-zinc-700 bg-zinc-800 shrink-0' />
            )}
          </div>
          {formik.touched.logo && formik.errors.logo && (
            <p className='text-red-400 text-xs mt-1'>{formik.errors.logo}</p>
          )}
        </div>

        <button
          type='submit'
          disabled={isLoading}
          className='mt-2 w-full flex items-center justify-center gap-2 bg-fuchsia-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-fuchsia-700 focus:outline-none focus:ring focus:ring-offset-2 focus:ring-fuchsia-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed'
        >
          {isLoading ? "Creating…" : "Create Project"}
          {!isLoading && <ArrowRightIcon size={32} />}
        </button>

        <button
          type='button'
          onClick={onBack}
          className='text-sm text-zinc-400 hover:text-zinc-200 transition-colors text-center'
        >
          ← Back
        </button>
      </form>
    </div>
  );
}

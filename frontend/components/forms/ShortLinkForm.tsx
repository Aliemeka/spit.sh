import useCreateLink from "@/hooks/useCreateLink";
import { useFormik } from "formik";
import React from "react";
import * as Yup from "yup";

const ShortLinkForm = () => {
  const { creating, handleCreateLink, shortenedLink } = useCreateLink();

  const formik = useFormik({
    initialValues: {
      url: "",
    },
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
    <section className='pt-4 pb-16 mt-12 max-w-xl mx-auto px-12 rounded-xl border border-gray-400 dark:border-gray-800 shadow-xl hover:border-fuchsia-500/10 hover:shadow-fuchsia-500/10 focus-within:shadow-fuchsia-500/10'>
      <h2 className='font-medium text-center text-xl md:text-2xl mt-8 mb-4 lg:mb-6 w-5/6 max-w-xl mx-auto'>
        Create a magic link ✨
      </h2>
      <form
        onSubmit={formik.handleSubmit}
        className='relative max-w-sm mx-auto focus-within:ring-offset-2 rounded-md focus-within:ring-offset-transparent focus-within:ring-1 focus-within:ring-fuchsia-200 focus-within:shadow-lg focus-within:shadow-fuchsia-400/50'
      >
        <label htmlFor='url' className='sr-only'>
          {" "}
          LongURL{" "}
        </label>

        <input
          type='text'
          inputMode='url'
          name='url'
          id='url'
          value={formik.values.url}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder='myfancylongwebsitename.com'
          className='w-full rounded-md px-4 border-gray-200 py-2.5 pe-10 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:text-sm focus:outline-none'
        />

        <span className='absolute inset-y-0 end-0 grid w-10 place-content-center'>
          <button
            type='submit'
            className='rounded-full bg-fuchsia-600 p-0.5 text-white hover:bg-fuchsia-700 dark:bg-fuchsia-500 dark:text-zinc-200 dark:hover:bg-fuchsia-600'
          >
            <span className='sr-only'>Submit</span>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              fill='currentColor'
              viewBox='0 0 256 256'
              className='ml-1'
            >
              <path d='M48,64a8,8,0,0,1,8-8H72V40a8,8,0,0,1,16,0V56h16a8,8,0,0,1,0,16H88V88a8,8,0,0,1-16,0V72H56A8,8,0,0,1,48,64ZM184,192h-8v-8a8,8,0,0,0-16,0v8h-8a8,8,0,0,0,0,16h8v8a8,8,0,0,0,16,0v-8h8a8,8,0,0,0,0-16Zm56-48H224V128a8,8,0,0,0-16,0v16H192a8,8,0,0,0,0,16h16v16a8,8,0,0,0,16,0V160h16a8,8,0,0,0,0-16ZM219.31,80,80,219.31a16,16,0,0,1-22.62,0L36.68,198.63a16,16,0,0,1,0-22.63L176,36.69a16,16,0,0,1,22.63,0l20.68,20.68A16,16,0,0,1,219.31,80Zm-54.63,32L144,91.31l-96,96L68.68,208ZM208,68.69,187.31,48l-32,32L176,100.69Z'></path>
            </svg>
          </button>
        </span>
      </form>

      {creating ? (
        <div className='max-w-sm mx-auto rounded-lg bg-slate-500 dark:bg-slate-700 h-10 animate-pulse mt-6' />
      ) : null}
      {shortenedLink ? (
        <a
          href={shortenedLink}
          target='_blank'
          className='max-w-sm mx-auto rounded-lg bg-slate-300 dark:bg-slate-800 h-14 justify-between flex items-center text-12 mt-6 px-4 hover:border border-fuchsia-500 hover:underline hover:text-fuchsia-500 dark:hover:text-fuchsia-400 group focus:ring-offset-2 focus:ring-offset-transparent focus:ring-1 focus:ring-fuchsia-200 focus:shadow-lg focus:shadow-fuchsia-400/50 transition-all duration-300'
        >
          <span className='hover:underline'>{shortenedLink}</span>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            fill='currentColor'
            viewBox='0 0 256 256'
          >
            <path d='M224,104a8,8,0,0,1-16,0V59.32l-66.33,66.34a8,8,0,0,1-11.32-11.32L196.68,48H152a8,8,0,0,1,0-16h64a8,8,0,0,1,8,8Zm-40,24a8,8,0,0,0-8,8v72H48V80h72a8,8,0,0,0,0-16H48A16,16,0,0,0,32,80V208a16,16,0,0,0,16,16H176a16,16,0,0,0,16-16V136A8,8,0,0,0,184,128Z'></path>
          </svg>
        </a>
      ) : null}
    </section>
  );
};

export default ShortLinkForm;

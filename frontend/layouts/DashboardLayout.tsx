import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import React, { FC, PropsWithChildren } from "react";

const DashboardLayout: FC<PropsWithChildren<{ title: string }>> = ({
  children,
  title,
}) => {
  return (
    <>
      <Head>
        <title>Spit.sh | Dashboard - {title}</title>
      </Head>
      <main className='flex h-screen bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200 relative'>
        <aside className='absolute left-0 inset-y-0 -translate-x-96 md:translate-x-0 md:relative z-20 flex h-screen flex-col justify-between border-e bg-zinc-50 dark:bg-zinc-950 dark:border-zinc-700 w-72'>
          <div className='px-4 py-6'>
            <Link
              href='/'
              className='text-fuchsia-600 dark:text-fuchsia-500 font-bold inline-block text-xl ml-2 mb-3'
            >
              Spit.sh ✨
            </Link>

            <ul className='mt-6 space-y-1'>
              <li>
                <Link
                  href=''
                  className='block rounded-lg bg-zinc-100 dark:bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-200'
                >
                  Home
                </Link>
              </li>

              <li>
                <details className='group [&_summary::-webkit-details-marker]:hidden'>
                  <summary className='flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700'>
                    <span className='text-sm font-medium'> Teams </span>

                    <span className='shrink-0 transition duration-300 group-open:-rotate-180'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-5 w-5'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        <path
                          fillRule='evenodd'
                          d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </span>
                  </summary>

                  <ul className='mt-2 space-y-1 px-4'>
                    <li>
                      <a
                        href=''
                        className='block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                      >
                        Banned Users
                      </a>
                    </li>

                    <li>
                      <a
                        href=''
                        className='block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                      >
                        Calendar
                      </a>
                    </li>
                  </ul>
                </details>
              </li>

              <li>
                <a
                  href=''
                  className='block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                >
                  Billing
                </a>
              </li>

              <li>
                <a
                  href=''
                  className='block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                >
                  Invoices
                </a>
              </li>

              <li>
                <details className='group [&_summary::-webkit-details-marker]:hidden'>
                  <summary className='flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700'>
                    <span className='text-sm font-medium'> Account </span>

                    <span className='shrink-0 transition duration-300 group-open:-rotate-180'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-5 w-5'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        <path
                          fillRule='evenodd'
                          d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </span>
                  </summary>

                  <ul className='mt-2 space-y-1 px-4'>
                    <li>
                      <a
                        href=''
                        className='block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                      >
                        Details
                      </a>
                    </li>

                    <li>
                      <a
                        href=''
                        className='block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                      >
                        Security
                      </a>
                    </li>

                    <li>
                      <form action='/logout'>
                        <button
                          type='submit'
                          className='w-full rounded-lg px-4 py-2 text-sm font-medium text-gray-500 [text-align:_inherit] hover:bg-gray-100 hover:text-gray-700'
                        >
                          Logout
                        </button>
                      </form>
                    </li>
                  </ul>
                </details>
              </li>
            </ul>
          </div>

          <div className='sticky inset-x-0 bottom-0 border-t border-gray-100 dark:border-gray-700'>
            <a
              href='#'
              className='flex items-center gap-2 bg-white dark:bg-slate-900 p-4 hover:bg-gray-50 dark:text-slate-100 dark:hover:bg-slate-800'
            >
              <Image
                alt='Man'
                src=''
                className='rounded-full object-cover'
                height={40}
                width={40}
              />

              <div>
                <p className='text-xs'>
                  <strong className='block font-medium'>Eric Frusciante</strong>

                  <span> eric@frusciante.com </span>
                </p>
              </div>
            </a>
          </div>
        </aside>
        <section className='flex-1 h-screen relative'>
          <nav className='py-5 px-6 border-b bg-zinc-50 dark:bg-zinc-950 dark:border-zinc-700 flex w-full justify-between items-center relative'>
            <Link
              href='/'
              className='text-fuchsia-600 dark:text-fuchsia-500 font-bold inline-block text-xl'
            >
              Spit.sh ✨
            </Link>
            <p className='text-sm'>
              <strong className='block font-medium'>Eric Frusciante</strong>
            </p>
          </nav>
          <main className='p-6 md:px-10 relative'>
            {/* <div className='h-full p-4 md:p-8 flex flex-col bg-inherit border dark:border-zinc-700 shadow-sm rounded-xl dark:shadow-slate-700/[.7]'>
              <div className='grid place-items-center p-4 md:p-5'>
                <svg
                  className='max-w-[5rem]'
                  viewBox='0 0 375 428'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M254.509 253.872L226.509 226.872'
                    className='stroke-gray-400 dark:stroke-white'
                    stroke='currentColor'
                    strokeWidth='7'
                    strokeLinecap='round'
                  />
                  <path
                    d='M237.219 54.3721C254.387 76.4666 264.609 104.226 264.609 134.372C264.609 206.445 206.182 264.872 134.109 264.872C62.0355 264.872 3.60864 206.445 3.60864 134.372C3.60864 62.2989 62.0355 3.87207 134.109 3.87207C160.463 3.87207 184.993 11.6844 205.509 25.1196'
                    className='stroke-gray-400 dark:stroke-white'
                    stroke='currentColor'
                    strokeWidth='7'
                    strokeLinecap='round'
                  />
                  <rect
                    x='270.524'
                    y='221.872'
                    width='137.404'
                    height='73.2425'
                    rx='36.6212'
                    transform='rotate(40.8596 270.524 221.872)'
                    className='fill-gray-400 dark:fill-white'
                    fill='currentColor'
                  />
                  <ellipse
                    cx='133.109'
                    cy='404.372'
                    rx='121.5'
                    ry='23.5'
                    className='fill-gray-400 dark:fill-white'
                    fill='currentColor'
                  />
                  <path
                    d='M111.608 188.872C120.959 177.043 141.18 171.616 156.608 188.872'
                    className='stroke-gray-400 dark:stroke-white'
                    stroke='currentColor'
                    strokeWidth='7'
                    strokeLinecap='round'
                  />
                  <ellipse
                    cx='96.6084'
                    cy='116.872'
                    rx='9'
                    ry='12'
                    className='fill-gray-400 dark:fill-white'
                    fill='currentColor'
                  />
                  <ellipse
                    cx='172.608'
                    cy='117.872'
                    rx='9'
                    ry='12'
                    className='fill-gray-400 dark:fill-white'
                    fill='currentColor'
                  />
                  <path
                    d='M194.339 147.588C189.547 148.866 189.114 142.999 189.728 138.038C189.918 136.501 191.738 135.958 192.749 137.131C196.12 141.047 199.165 146.301 194.339 147.588Z'
                    className='fill-gray-400 dark:fill-white'
                    fill='currentColor'
                  />
                </svg>
                <p className='mt-5 text-sm text-gray-500 dark:text-gray-500'>
                  No data to show
                </p>
              </div>
            </div> */}
            {children}
          </main>
        </section>
      </main>
    </>
  );
};

export default DashboardLayout;

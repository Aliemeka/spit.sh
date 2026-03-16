"use client";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { deleteUserCookie } from "@/app/actions/auth";
import Image from "next/image";

const DashboardSidebar = ({ workspaceSlug }: { workspaceSlug: string }) => {
  const { data: session } = useSession();

  const handleLogout = async () => {
    await Promise.all([signOut(), deleteUserCookie()]);
    window.location.href = "/signin";
  };

  return (
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
              href={`/dashboard/${workspaceSlug}`}
              className='block rounded-lg bg-zinc-100 dark:bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-200'
            >
              Home
            </Link>
          </li>

          <li>
            <details className='group [&_summary::-webkit-details-marker]:hidden'>
              <summary className='flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700'>
                <span className='text-sm font-medium'> Links </span>

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
                    href={`/dashboard/${workspaceSlug}/links`}
                    className='block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  >
                    All Links
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
              Analytics
            </a>
          </li>

          <li>
            <a
              href=''
              className='block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700'
            >
              Pages
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
                    Settings
                  </a>
                </li>

                <li>
                  <a
                    href=''
                    className='block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  >
                    Team
                  </a>
                </li>

                <li>
                  <button
                    onClick={handleLogout}
                    className='w-full rounded-lg px-4 py-2 text-sm font-medium text-gray-500 [text-align:_inherit] hover:bg-gray-100 hover:text-gray-700'
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>

      <div className='sticky inset-x-0 bottom-0 border-t border-gray-100 dark:border-gray-700'>
        <div className='flex items-center gap-2 bg-white dark:bg-slate-900 p-4 dark:text-slate-100'>
          <Image
            alt={session?.user.name ?? "User"}
            src={
              session?.user.image ??
              `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${encodeURIComponent(session?.user.email ?? "user")}`
            }
            className='rounded-full object-cover'
            height={40}
            width={40}
          />
          <div>
            <p className='text-xs'>
              <strong className='block font-medium'>
                {session?.user.name ?? "—"}
              </strong>
              <span>{session?.user.email}</span>
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;

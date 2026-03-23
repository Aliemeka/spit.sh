"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { deleteUserCookie } from "@/app/actions/auth";
import Image from "next/image";
import {
  authRoutes,
  marketingRoutes,
  dashboardRoutes,
} from "@/lib/constants/routes";
import { SidebarSimpleIcon as SidebarIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const activeClass =
  "block rounded-lg bg-zinc-100 dark:bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-200";
const inactiveClass =
  "block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700";

const ChevronIcon = () => (
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
);

const DashboardSidebar = ({
  workspaceSlug,
  showSidebar,
  setShowSidebar,
}: {
  workspaceSlug: string;
  showSidebar: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  const handleLogout = async () => {
    await Promise.all([signOut(), deleteUserCookie()]);
    window.location.href = authRoutes.signIn;
  };

  const linksChildren = [dashboardRoutes.links(workspaceSlug)];
  const accountChildren: string[] = [];
  const isLinksOpen = linksChildren.some(isActive);
  const isAccountOpen = accountChildren.some(isActive);

  return (
    <aside
      className={cn(
        "absolute left-0 inset-y-0 overflow-y-scroll md:translate-x-0 md:relative z-20 flex h-screen flex-col justify-between border-e bg-zinc-50 dark:bg-zinc-950 dark:border-zinc-700 w-72",
        "transition-transform duration-300 ease-in-out",
        showSidebar ? "translate-x-0" : "-translate-x-96",
      )}
    >
      <div className='px-4 py-6'>
        <div className='flex items-center gap-4 ml-2 mb-3'>
          <button
            className='md:hidden'
            type='button'
            aria-label='Toggle sidebar'
            onClick={() => setShowSidebar((prev) => !prev)}
          >
            <SidebarIcon
              className={cn(
                "h-6 w-6 text-zinc-900 dark:text-zinc-200",
                showSidebar &&
                  "shadow-sm shadow-fuchsia-300/50 dark:shadow-fuchsia-900/50",
              )}
            />
          </button>
          <Link
            href={marketingRoutes.home}
            className='text-fuchsia-600 dark:text-fuchsia-500 font-bold inline-block text-xl'
          >
            Spit.sh ✨
          </Link>
        </div>

        <ul className='mt-6 space-y-1'>
          <li>
            <Link
              href={dashboardRoutes.project(workspaceSlug)}
              className={
                isActive(dashboardRoutes.project(workspaceSlug))
                  ? activeClass
                  : inactiveClass
              }
            >
              Home
            </Link>
          </li>

          <li>
            <details
              open={isLinksOpen}
              className='group [&_summary::-webkit-details-marker]:hidden'
            >
              <summary className='flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700'>
                <span className='text-sm font-medium'> Links </span>
                <span className='shrink-0 transition duration-300 group-open:-rotate-180'>
                  <ChevronIcon />
                </span>
              </summary>

              <ul className='mt-2 space-y-1 px-4'>
                <li>
                  <Link
                    href={dashboardRoutes.links(workspaceSlug)}
                    className={
                      isActive(dashboardRoutes.links(workspaceSlug))
                        ? activeClass
                        : inactiveClass
                    }
                  >
                    All Links
                  </Link>
                </li>

                <li>
                  <a href='' className={inactiveClass}>
                    Calendar
                  </a>
                </li>
              </ul>
            </details>
          </li>

          <li>
            <a href='' className={inactiveClass}>
              Analytics
            </a>
          </li>

          <li>
            <a href='' className={inactiveClass}>
              Pages
            </a>
          </li>

          <li>
            <a href='' className={inactiveClass}>
              Invoices
            </a>
          </li>

          <li>
            <details
              open={isAccountOpen}
              className='group [&_summary::-webkit-details-marker]:hidden'
            >
              <summary className='flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700'>
                <span className='text-sm font-medium'> Account </span>
                <span className='shrink-0 transition duration-300 group-open:-rotate-180'>
                  <ChevronIcon />
                </span>
              </summary>

              <ul className='mt-2 space-y-1 px-4'>
                <li>
                  <a href='' className={inactiveClass}>
                    Settings
                  </a>
                </li>

                <li>
                  <a href='' className={inactiveClass}>
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

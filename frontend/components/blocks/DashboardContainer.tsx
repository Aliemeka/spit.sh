"use client";
import { useState, ReactNode, useEffect } from "react";
import DashboardSidebar from "./DashboardSidebar";
import { SidebarSimpleIcon as SidebarIcon } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";
import UpgradeButton from "@/components/billing/UpgradeButton";

const DashboardContainer = ({
  workspaceSlug,
  children,
}: {
  workspaceSlug: string;
  children: ReactNode;
}) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setShowSidebar(false);
  }, [pathname]);

  return (
    <>
      <DashboardSidebar
        workspaceSlug={workspaceSlug}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
      />
      {showSidebar && (
        <div
          className='fixed inset-0 z-10 bg-black/50 md:hidden'
          onClick={() => setShowSidebar(false)}
        />
      )}
      <section className='flex-1 h-screen relative overflow-hidden'>
        <header
          aria-label='Beta banner'
          className='text-xs text-center font-medium px-3 py-1.5 border border-x-0 border-fuchsia-200 dark:border-fuchsia-900 text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-50 dark:bg-fuchsia-950/50'
        >
          Spit.sh is currently in beta. Reach out to us via{" "}
          <a
            href='mailto:emekaallison4@gmail.com'
            className='underline hover:text-fuchsia-700 dark:hover:text-fuchsia-300'
          >
            email
          </a>
        </header>
        <nav className='py-5 px-6 border-b bg-zinc-50 dark:bg-zinc-950 dark:border-zinc-700 flex w-full justify-between items-center relative'>
          <div className='flex gap-x-3 items-center'>
            {!showSidebar && (
              <button
                onClick={() => setShowSidebar(true)}
                type='button'
                className='md:hidden active:text-fuchsia-200'
                aria-label='Open sidebar'
              >
                <SidebarIcon className='h-6 w-6 text-zinc-900 dark:text-zinc-200' />
              </button>
            )}
            <h1 className='text-lg font-semibold'>Dashboard</h1>
          </div>
          <div className='flex items-center gap-2'>
            <UpgradeButton projectSlug={workspaceSlug} />
          </div>
        </nav>
        {/* Revert to h-[calc(100dvh-64px)] when beta banner is removed */}
        <main className='p-6 md:px-10 relative w-dvw md:w-full overflow-y-auto h-[calc(100dvh-94px)]'>
          {children}
        </main>
      </section>
    </>
  );
};

export default DashboardContainer;

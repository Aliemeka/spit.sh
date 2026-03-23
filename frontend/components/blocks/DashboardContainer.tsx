"use client";
import { useState, ReactNode } from "react";
import DashboardSidebar from "./DashboardSidebar";
import QueryProvider from "@/providers/QueryProvider";
import { SidebarSimpleIcon as SidebarIcon } from "@phosphor-icons/react";

const DashboardContainer = ({
  workspaceSlug,
  children,
}: {
  workspaceSlug: string;
  children: ReactNode;
}) => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
      <DashboardSidebar
        workspaceSlug={workspaceSlug}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
      />
      <section className='flex-1 h-screen relative'>
        <nav className='py-5 px-6 border-b bg-zinc-50 dark:bg-zinc-950 dark:border-zinc-700 flex w-full justify-between items-center relative'>
          <div className='flex gap-x-3 items-center'>
            {!showSidebar && (
              <button
                onClick={() => setShowSidebar(true)}
                type='button'
                className='md:hidden active:text-fuchsia-200'
              >
                <SidebarIcon className='h-6 w-6 text-zinc-900 dark:text-zinc-200' />
              </button>
            )}
            <h1 className='text-lg font-semibold'>Dashboard</h1>
          </div>
          <p className='text-xs font-medium px-3 py-1.5 border border-fuchsia-200 dark:border-fuchsia-900 text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-50 dark:bg-fuchsia-950/50 rounded-full'>
            Currently in beta
          </p>
        </nav>
        <main className='p-6 md:px-10 relative w-dvw md:w-full overflow-y-auto h-[calc(100dvh-64px)]'>
          <QueryProvider>{children}</QueryProvider>
        </main>
      </section>
    </>
  );
};

export default DashboardContainer;

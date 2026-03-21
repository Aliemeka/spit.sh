import { Suspense } from "react";
import { PlusCircleIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import DashboardLayout from "@/layouts/DashboardLayout";
import { linkRoutes } from "@/lib/constants/routes";
import WelcomeCard from "@/components/pageBundles/home/WelcomeCard";
import OnboardingSteps from "@/components/pageBundles/home/OnboardingSteps";
import RecentLinks from "@/components/pageBundles/home/RecentLinks";

const DashboardHomePage = ({
  params,
}: {
  params: { "project-slug": string };
}) => {
  const slug = params["project-slug"];

  return (
    <DashboardLayout
      title='Home'
      SideButton={
        <Link
          href={linkRoutes.newLink(slug)}
          className='inline-flex items-center rounded-full bg-fuchsia-600 px-6 py-2.5 text-sm font-semibold text-white gap-x-1.5 hover:bg-fuchsia-700 focus:outline-none focus:ring active:bg-fuchsia-800 transition'
        >
          <span>Create new link</span>
          <PlusCircleIcon size={16} weight='bold' />
        </Link>
      }
    >
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 gap-y-6 md:gap-y-10 mt-4'>
        <WelcomeCard />

        <Suspense
          fallback={
            <div className='rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 animate-pulse'>
              <div className='h-3 w-24 rounded-full bg-zinc-200 dark:bg-zinc-700 mb-4' />
              <div className='space-y-3'>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className='flex items-center gap-3'>
                    <div className='h-4 w-4 rounded-full bg-zinc-200 dark:bg-zinc-700 shrink-0' />
                    <div className='h-3 rounded-full bg-zinc-200 dark:bg-zinc-700 w-3/5' />
                  </div>
                ))}
              </div>
            </div>
          }
        >
          <OnboardingSteps projectSlug={slug} />
        </Suspense>

        <RecentLinks projectSlug={slug} />
      </div>
    </DashboardLayout>
  );
};

export default DashboardHomePage;

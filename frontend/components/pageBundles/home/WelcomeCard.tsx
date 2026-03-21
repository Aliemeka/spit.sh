"use client";

import { useSession } from "@/lib/auth-client";

const WelcomeCard = () => {
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  return (
    <div className='rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6'>
      <p className='text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2'>
        Welcome back
      </p>
      <h2 className='text-2xl font-semibold text-zinc-900 dark:text-zinc-100'>
        Hey, {firstName} 👋
      </h2>
      <p className='mt-2 text-sm text-zinc-500 dark:text-zinc-400'>
        Here&apos;s a quick overview of your workspace and recent activity.
      </p>
    </div>
  );
};

export default WelcomeCard;

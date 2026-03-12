import Float from "@/components/illustrations/Float";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Spit.sh - Sign in to your account",
  description: "Get more out of your links with analytics and tracking",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className='lg:grid lg:grid-cols-2 xl:grid-cols-5 min-h-dvh divide-x divide-zinc-300/60 dark:divide-zinc-700/50'>
      <section className='h-full xl:col-span-2'>{children}</section>
      <section className='dot-overlay md:grid xl:col-span-3 md:place-items-center bg-zinc-100 dark:bg-zinc-900 hidden'>
        <div className='xl:max-w-[600px] w-full px-6 py-12 space-y-8'>
          <Float />
          <p className='text-center max-w-sm mx-auto text-xl font-semibold text-zinc-700 dark:text-zinc-300 pt-12'>
            Stop guessing! 🤔
            <br /> Start knowing. Real-time insights for every link you share.
          </p>
        </div>
      </section>
    </main>
  );
}

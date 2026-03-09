"use client";

import ThemeButton from "@/components/units/ThemeButton";
import { useSession } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <header className='absolute inset-x-0 z-30'>
      <nav className='flex py-4 md:py-6 px-12 w-full max-w-7xl items-center inset-x-auto justify-between dark:bg-zinc-900 dark:text-zinc-200 mx-auto bg-opacity-20'>
        <h1 className='text-fuchsia-600 dark:text-fuchsia-500 font-bold inline-block text-xl'>
          Spit.sh ✨
        </h1>
        <div className='flex gap-x-4 md:gap-x-8 items-center'>
          {session ? (
            <>
              <Link
                href='/dashboard'
                className='hidden md:flex items-center gap-x-2 dark:text-zinc-200 text-sm font-medium hover:underline underline-offset-4'
              >
                <Image
                  src={
                    session.user.image ??
                    `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${encodeURIComponent(session.user.email ?? "user")}`
                  }
                  alt={session.user.name ?? "User"}
                  width={22}
                  height={22}
                  className='rounded-full object-cover bg-fuchsia-400'
                />
                Go to dashboard
              </Link>
              <Link href='/dashboard' className='md:hidden'>
                <Image
                  src={
                    session.user.image ??
                    `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${encodeURIComponent(session.user.email ?? "user")}`
                  }
                  alt={session.user.name ?? "User"}
                  width={22}
                  height={22}
                  className='rounded-full object-cover bg-fuchsia-400'
                />
              </Link>
            </>
          ) : (
            <Link
              href='/signin'
              className='duration-200 transition-colors hover:text-fuchsia-600 dark:hover:text-fuchsia-500'
            >
              Sign in
            </Link>
          )}
          <ThemeButton />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

"use client";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import React from "react";
import GithubIcon from "../icons/GithubIcon";

const HomeButtons = () => {
  const { data: session } = useSession();
  const isLoggedIn = !!session;
  return (
    <div className='flex flex-col items-center justify-center sm:flex-row gap-x-6 gap-y-4 sm:gap-y-0'>
      <Link
        className='inline-flex rounded-full bg-fuchsia-600 px-8 py-3 text-sm font-semibold text-white transition hover:rotate-6 hover:scale-110 focus:outline-none focus:ring active:bg-fuchsia-500'
        href={isLoggedIn ? "/dashboard" : "/signin"}
      >
        {isLoggedIn ? "Go to dashboard" : "Get started for free"}
      </Link>
      <a
        href='https://github.com/aliemeka/spit.sh'
        target='_blank'
        className='inline-flex items-center rounded-full bg-zinc-800 dark:bg-zinc-50 px-8 py-3 text-sm font-semibold text-zinc-100 dark:text-zinc-800 transition hover:-rotate-6 hover:scale-110 focus:outline-none focus:ring active:bg-indigo-500'
      >
        <GithubIcon />
        Star on GitHub
      </a>
    </div>
  );
};

export default HomeButtons;

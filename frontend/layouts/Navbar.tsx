"use client";
import AuthCta, { SignInLink } from "@/components/units/AuthCta";
import ThemeButton from "@/components/units/ThemeButton";
import { ListIcon, XIcon } from "@phosphor-icons/react";
import Link from "next/link";
import React, { useState } from "react";
import { btnPrimary, container } from "@/components/pageBundles/landingPage/tokens";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className='sticky top-0 z-40 border-b border-zinc-900/5 bg-zinc-100/80 backdrop-blur-md dark:border-white/5 dark:bg-zinc-950/80'>
      <nav
        className={`${container} grid grid-cols-[1fr_auto] items-center gap-6 py-3 md:grid-cols-[1fr_auto_1fr]`}
      >
        <Link
          href='/'
          className='text-xl font-bold text-fuchsia-600 dark:text-fuchsia-500'
        >
          Spit.sh ✨
        </Link>

        <div className='hidden items-center gap-8 md:flex'>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className='text-[15px] text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50'
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className='flex items-center justify-self-end gap-3'>
          <SignInLink className='mr-1 hidden text-[15px] font-medium text-zinc-700 transition hover:text-fuchsia-600 dark:text-zinc-300 dark:hover:text-fuchsia-400 sm:inline' />
          <AuthCta
            label='Get started'
            className={`${btnPrimary} hidden !h-9 !px-4 sm:inline-flex`}
          />
          <button
            type='button'
            onClick={() => setOpen((prev) => !prev)}
            className='grid h-9 w-9 place-items-center rounded-xl text-zinc-800 hover:bg-zinc-900/5 dark:text-zinc-200 dark:hover:bg-white/10 md:hidden'
            aria-label='Toggle menu'
            aria-expanded={open}
          >
            {open ? <XIcon size={20} /> : <ListIcon size={20} />}
          </button>
          <ThemeButton />
        </div>
      </nav>

      {open ? (
        <div className={`${container} flex flex-col gap-1 pb-4 md:hidden`}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className='rounded-xl px-3 py-2.5 text-[15px] text-zinc-700 hover:bg-zinc-900/5 dark:text-zinc-300 dark:hover:bg-white/5'
            >
              {link.label}
            </a>
          ))}
          <SignInLink className='rounded-xl px-3 py-2.5 text-[15px] text-zinc-700 hover:bg-zinc-900/5 dark:text-zinc-300 dark:hover:bg-white/5' />
          <AuthCta label='Get started' className={`${btnPrimary} mt-2 w-full`} />
        </div>
      ) : null}
    </header>
  );
};

export default Navbar;

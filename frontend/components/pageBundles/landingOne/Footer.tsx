import AnimatedCircle from "@/components/illustrations/AnimatedCircle";
import AnimatedTriangle from "@/components/illustrations/AnimatedTriangle";
import { marketingRoutes } from "@/lib/constants/routes";
import {
  GithubLogoIcon,
  InstagramLogoIcon,
  XLogoIcon,
} from "@phosphor-icons/react/dist/ssr";
import React from "react";
import { body, container } from "./tokens";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Pricing", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Open source",
    links: [
      { label: "GitHub", href: "https://github.com/aliemeka/spit.sh" },
      { label: "Issues", href: "https://github.com/aliemeka/spit.sh/issues" },
      { label: "Contribute", href: "https://github.com/aliemeka/spit.sh/pulls" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", href: marketingRoutes.terms },
      { label: "Privacy", href: marketingRoutes.privacy },
    ],
  },
];

const socials = [
  { label: "GitHub", href: "https://github.com/aliemeka/spit.sh", icon: GithubLogoIcon },
  { label: "X", href: "/", icon: XLogoIcon },
  { label: "Instagram", href: "/", icon: InstagramLogoIcon },
];

const Footer = () => {
  return (
    <>
      <section className={`${container} pb-24`}>
        <div className='relative overflow-hidden rounded-3xl bg-zinc-800 px-6 py-16 text-center text-zinc-300 dark:border dark:border-white/10 dark:bg-zinc-900 md:px-16 md:py-24'>
          <AnimatedCircle
            size={160}
            strokeWidth={1.5}
            className='pointer-events-none absolute -left-10 -top-10 opacity-40'
          />
          <AnimatedTriangle
            size={120}
            strokeWidth={1.5}
            rotation={-14}
            className='pointer-events-none absolute -bottom-6 right-6 opacity-40'
            style={{ ["--shape-delay" as string]: "1.2s" }}
          />
          <div className='relative mx-auto flex max-w-2xl flex-col items-center gap-6'>
            <h2 className='text-balance text-3xl font-bold leading-tight tracking-[-0.04em] text-white md:text-5xl'>
              Spit.sh is{" "}
              <span className='text-fuchsia-400'>open-source</span> 🤯
            </h2>
            <p className='text-lg leading-relaxed'>
              Step into a world of magic and efficiency as you create shorter
              links with Spit.sh, empowering your online presence.
            </p>
            <code className='rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 font-mono text-xs text-zinc-300 sm:text-sm'>
              <span className='text-fuchsia-400'>$</span> git clone
              https://github.com/aliemeka/spit.sh
            </code>
            <a
              href='https://github.com/aliemeka/spit.sh'
              target='_blank'
              className='inline-flex h-[42px] items-center gap-2 rounded-2xl bg-zinc-50 px-6 text-sm font-semibold text-zinc-800 transition hover:-rotate-6 hover:scale-110 hover:bg-white'
            >
              Give us a star on GitHub
              <GithubLogoIcon size={18} weight='fill' />
            </a>
          </div>
        </div>
      </section>

      <footer className='border-t border-zinc-900/10 bg-zinc-100 dark:border-white/10 dark:bg-zinc-900/50'>
        <div
          className={`${container} grid gap-12 py-16 md:grid-cols-[1.5fr_repeat(3,1fr)]`}
        >
          <div className='flex flex-col gap-4'>
            <p className='text-xl font-bold text-fuchsia-600 dark:text-fuchsia-500'>
              Spit.sh ✨
            </p>
            <p className={`${body} max-w-xs text-sm leading-relaxed`}>
              Shorter URLs with extra magic. Custom domains, realtime
              analytics, QR codes, dynamic links and pages.
            </p>
            <div className='flex gap-2'>
              {socials.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target='_blank'
                  rel='noreferrer'
                  aria-label={label}
                  className='grid h-9 w-9 place-items-center rounded-xl border border-zinc-900/10 text-zinc-600 transition hover:text-fuchsia-600 dark:border-white/10 dark:text-zinc-400 dark:hover:text-fuchsia-400'
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
          {columns.map((column) => (
            <div key={column.title} className='flex flex-col gap-3'>
              <p className='text-sm font-semibold text-zinc-900 dark:text-zinc-50'>
                {column.title}
              </p>
              {column.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className='text-sm text-zinc-600 transition hover:text-fuchsia-600 dark:text-zinc-400 dark:hover:text-fuchsia-400'
                >
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div className='border-t border-zinc-900/10 dark:border-white/10'>
          <p className={`${container} py-6 text-xs text-zinc-500`}>
            © {new Date().getFullYear()} Spit.sh. Made with a little magic ✨
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;

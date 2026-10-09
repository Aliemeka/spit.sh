import Float from "@/components/illustrations/Float";
import Unboxing from "@/components/illustrations/Unboxing";
import {
  AndroidLogoIcon,
  AppleLogoIcon,
  ArrowRightIcon,
  ArrowsSplitIcon,
  BrowserIcon,
  GlobeHemisphereWestIcon,
  MapPinIcon,
} from "@phosphor-icons/react/dist/ssr";
import React from "react";
import { band, body, card, container, heading, sectionLabel } from "./tokens";

const steps = [
  {
    title: "Paste your long URL",
    copy: "Drop in any link, however long or ugly it is.",
  },
  {
    title: "Sprinkle the magic",
    copy: "Pick a custom slug and domain, add tags and UTM parameters.",
  },
  {
    title: "Share it anywhere",
    copy: "Post it, print it as a QR code, or pin it to your Page.",
  },
  {
    title: "Watch it work",
    copy: "Clicks, countries and referrers roll in as they happen.",
  },
];

const routes = [
  { icon: AppleLogoIcon, when: "On iPhone", to: "apps.apple.com/your-app" },
  { icon: AndroidLogoIcon, when: "On Android", to: "play.google.com/your-app" },
  { icon: MapPinIcon, when: "From Nigeria", to: "yoursite.com/ng" },
  { icon: GlobeHemisphereWestIcon, when: "Everyone else", to: "yoursite.com" },
];

const HowItWorks = () => {
  return (
    <>
      <section id='how-it-works' className={`${band} scroll-mt-20 py-24 md:py-28`}>
        <div className={`${container} grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20`}>
          <div className='flex flex-col gap-4'>
            <p className={sectionLabel}>/How it works</p>
            <h2
              className={`${heading} text-balance text-3xl font-bold leading-tight md:text-5xl`}
            >
              From long and messy to short and{" "}
              <i className='text-fuchsia-600 dark:text-fuchsia-500'>snappy</i>.
            </h2>
            <p className={`${body} text-lg leading-relaxed`}>
              Four steps, a few seconds, and your link is ready for the world.
            </p>
            <div className='mx-auto mt-4 w-full max-w-md text-zinc-900 dark:text-zinc-200 [&>svg]:h-auto [&>svg]:w-full'>
              <Float />
            </div>
          </div>

          <ol className='relative flex flex-col gap-4'>
            <span
              aria-hidden
              className='absolute bottom-8 left-[27px] top-8 w-px bg-gradient-to-b from-fuchsia-500/60 via-zinc-900/10 to-zinc-900/10 dark:via-white/10 dark:to-white/10'
            />
            {steps.map((step, index) => (
              <li key={step.title} className={`${card} relative flex gap-5 p-5`}>
                <span
                  className={`relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full font-mono text-sm font-semibold ${
                    index === 0
                      ? "bg-fuchsia-600 text-white dark:bg-fuchsia-500"
                      : "border border-zinc-900/10 bg-zinc-50 text-zinc-700 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-300"
                  }`}
                >
                  {index + 1}
                </span>
                <div>
                  <h3 className={`${heading} font-semibold tracking-[-0.02em]`}>
                    {step.title}
                  </h3>
                  <p className={`${body} mt-1 text-sm`}>{step.copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className='py-24 md:py-28'>
        <div className={`${container} flex flex-col gap-12`}>
          <div className='flex max-w-2xl flex-col gap-4'>
            <p className={sectionLabel}>/New tricks</p>
            <h2
              className={`${heading} text-balance text-3xl font-bold leading-tight md:text-5xl`}
            >
              Links that think, pages that{" "}
              <i className='text-fuchsia-600 dark:text-fuchsia-500'>pop</i>.
            </h2>
          </div>

          <div className='grid gap-4 lg:grid-cols-2'>
            <article className={`${card} flex flex-col gap-8 p-6 md:p-8`}>
              <div className='flex items-center gap-3'>
                <span className='grid h-11 w-11 place-items-center rounded-2xl bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-500/10 dark:text-fuchsia-400'>
                  <ArrowsSplitIcon size={20} />
                </span>
                <h3 className={`${heading} text-2xl font-semibold`}>
                  Dynamic links
                </h3>
              </div>
              <p className={`${body} leading-relaxed`}>
                One short link that sends each visitor to the right place,
                based on their device or where they are. Change the destination
                any time and the link you already shared keeps working.
              </p>
              <ul className='mt-auto flex flex-col gap-2'>
                {routes.map(({ icon: Icon, when, to }) => (
                  <li
                    key={when}
                    className='flex items-center gap-3 rounded-xl bg-zinc-50 px-4 py-3 text-sm dark:bg-zinc-950'
                  >
                    <Icon size={18} className='shrink-0 text-zinc-500' />
                    <span className='w-28 shrink-0 font-medium text-zinc-800 dark:text-zinc-200'>
                      {when}
                    </span>
                    <ArrowRightIcon size={14} className='shrink-0 text-fuchsia-500' />
                    <span className='truncate font-mono text-xs text-zinc-500'>
                      {to}
                    </span>
                  </li>
                ))}
              </ul>
            </article>

            <article className={`${card} flex flex-col gap-8 overflow-hidden p-6 md:p-8`}>
              <div className='flex items-center gap-3'>
                <span className='grid h-11 w-11 place-items-center rounded-2xl bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-500/10 dark:text-fuchsia-400'>
                  <BrowserIcon size={20} />
                </span>
                <h3 className={`${heading} text-2xl font-semibold`}>Pages</h3>
              </div>
              <p className={`${body} leading-relaxed`}>
                A link-in-bio page that&apos;s actually yours. Gather every
                link, social and launch in one place, with your domain and your
                analytics.
              </p>
              <div className='-mb-10 mt-auto text-zinc-900 dark:text-zinc-200 [&>svg]:h-auto [&>svg]:w-full'>
                <Unboxing />
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
};

export default HowItWorks;

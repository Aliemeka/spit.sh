import Groovy from "@/components/illustrations/Groovy";
import AuthCta from "@/components/units/AuthCta";
import {
  ArrowRightIcon,
  ArrowsSplitIcon,
  BrowserIcon,
  CalendarIcon,
  ChartLineUpIcon,
  DeviceMobileIcon,
  ForkKnifeIcon,
  GlobeIcon,
  LinkIcon,
  MagicWandIcon,
  MicrophoneIcon,
  NewspaperIcon,
  PencilSimpleIcon,
  QrCodeIcon,
  RocketLaunchIcon,
  TagIcon,
  TargetIcon,
  TicketIcon,
  UserCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import React from "react";
import {
  body,
  btnPrimary,
  card,
  container,
  heading,
  sectionLabel,
} from "./tokens";

const useCases = [
  { label: "Newsletters", icon: NewspaperIcon },
  { label: "Podcasts", icon: MicrophoneIcon },
  { label: "Product launches", icon: RocketLaunchIcon },
  { label: "Event tickets", icon: TicketIcon },
  { label: "Restaurant menus", icon: ForkKnifeIcon },
  { label: "Link-in-bio", icon: UserCircleIcon },
  { label: "App downloads", icon: DeviceMobileIcon },
  { label: "Campaigns", icon: CalendarIcon },
];

type Detail = {
  name: string;
  copy: string;
} & ({ icon: Icon; keys?: never } | { keys: string[]; icon?: never });

const details: Detail[] = [
  {
    icon: GlobeIcon,
    name: "Beautiful custom domains",
    copy: "Put your brand on every link with a domain you already own.",
  },
  {
    icon: LinkIcon,
    name: "A new link in one key",
    copy: "Press N anywhere in your links to create one. No mouse needed.",
  },
  {
    icon: ChartLineUpIcon,
    name: "Realtime analytics",
    copy: "Watch clicks land by country, city, device and referrer.",
  },
  {
    icon: ArrowsSplitIcon,
    name: "Dynamic links",
    copy: "Send iPhone, Android and everyone else to different places from one link.",
  },
  {
    icon: QrCodeIcon,
    name: "QR code generator",
    copy: "A scannable QR code for every link, ready for posters and menus.",
  },
  {
    icon: BrowserIcon,
    name: "Pages",
    copy: "A link-in-bio page for all your links, on your own domain.",
  },
  {
    icon: PencilSimpleIcon,
    name: "Custom slugs",
    copy: "spit.sh/launch beats spit.sh/x7Kq. Pick your own back half.",
  },
  {
    icon: TargetIcon,
    name: "UTM parameters",
    copy: "Add source, medium and campaign without hand-editing URLs.",
  },
  {
    icon: TagIcon,
    name: "Tags",
    copy: "Group links by campaign, promo or support and find them fast.",
  },
  {
    icon: MagicWandIcon,
    name: "Free magic links",
    copy: "Shorten a link right here on this page. No account needed.",
  },
];

const CornerDot = ({ className }: { className: string }) => (
  <span
    aria-hidden
    className={`absolute z-10 h-2 w-2 rounded-full border border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 ${className}`}
  />
);

const Marquee = () => {
  const items = [...useCases, ...useCases];
  return (
    <div className='relative overflow-hidden border-y border-zinc-900/10 py-8 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] dark:border-white/10'>
      <div className='flex w-max animate-marquee gap-12 motion-reduce:animate-none'>
        {items.map(({ label, icon: Icon }, index) => (
          <span
            key={`${label}-${index}`}
            aria-hidden={index >= useCases.length}
            className='flex items-center gap-2 text-lg font-semibold text-zinc-400 dark:text-zinc-600'
          >
            <Icon size={22} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};

const Features = () => {
  return (
    <section id='features' className='scroll-mt-20 py-24 md:py-28'>
      <div className={`${container} flex flex-col gap-14`}>
        <div className='flex max-w-2xl flex-col gap-4'>
          <p className={sectionLabel}>/Features</p>
          <h2
            className={`${heading} text-balance text-3xl font-bold leading-tight md:text-5xl`}
          >
            Maximize your marketing{" "}
            <i className='text-fuchsia-600 dark:text-fuchsia-500'>mojo</i>💪🏼
          </h2>
          <p className={`${body} text-lg leading-relaxed`}>
            Gain an edge with custom links, track performance with robust
            analytics, and generate QR codes among other tricks.
          </p>
        </div>

        <div className='grid gap-4 lg:grid-cols-3 xl:grid-cols-[1.4fr_1fr] xl:grid-rows-2'>
          <article
            className={`${card} flex flex-col gap-6 p-6 xl:col-start-1 xl:row-start-1 xl:flex-row xl:items-center xl:gap-8`}
          >
            <div className='flex min-h-44 flex-col justify-center gap-2 rounded-xl bg-zinc-50 p-5 dark:bg-zinc-950 xl:w-[55%] xl:shrink-0 xl:self-stretch'>
              {[
                "go.yourbrand.com/launch",
                "links.acme.co/menu",
                "spit.sh/podcast",
              ].map((domain, index) => (
                <span
                  key={domain}
                  style={{ marginLeft: `${index * 18}px` }}
                  className={`w-fit rounded-full border px-3 py-1.5 font-mono text-xs ${
                    index === 0
                      ? "border-fuchsia-500/30 bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-500/10 dark:text-fuchsia-300"
                      : "border-zinc-900/10 bg-white text-zinc-600 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-400"
                  }`}
                >
                  {domain}
                </span>
              ))}
            </div>
            <div>
              <h3 className={`${heading} text-xl font-semibold`}>
                Connect your own domain
              </h3>
              <p className={`${body} mt-2 text-sm leading-relaxed`}>
                Short links that look like you. Point a domain you already own
                at Spit.sh and every link carries your brand.
              </p>
            </div>
          </article>

          <article
            className={`${card} flex flex-col gap-6 p-6 xl:col-start-1 xl:row-start-2 xl:flex-row xl:items-center xl:gap-8`}
          >
            <div className='flex min-h-44 items-end gap-2 rounded-xl bg-zinc-50 p-5 dark:bg-zinc-950 xl:w-[55%] xl:shrink-0 xl:self-stretch'>
              {[38, 52, 44, 66, 58, 80, 72, 96].map((height, index) => (
                <span
                  key={index}
                  style={{ height: `${height}%` }}
                  className={`flex-1 rounded-md ${
                    index === 7
                      ? "bg-fuchsia-600 dark:bg-fuchsia-500"
                      : "bg-zinc-900/10 dark:bg-white/10"
                  }`}
                />
              ))}
            </div>
            <div>
              <h3 className={`${heading} text-xl font-semibold`}>
                Watch every click land
              </h3>
              <p className={`${body} mt-2 text-sm leading-relaxed`}>
                See where clicks come from (country, city, device and referrer)
                the moment they happen.
              </p>
            </div>
          </article>

          <article className='flex flex-col justify-between gap-6 overflow-hidden rounded-2xl bg-zinc-800 p-6 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-800 xl:col-start-2 xl:row-span-2 xl:row-start-1'>
            <div className='-mx-10 -mt-6 text-zinc-50 dark:text-zinc-800 [&>svg]:h-auto [&>svg]:w-full'>
              <Groovy />
            </div>
            <div className='flex flex-col items-start gap-4'>
              <p className='font-mono text-xs uppercase tracking-[0.18em] text-fuchsia-300 dark:text-fuchsia-600'>
                Ready when you are
              </p>
              <h3 className='text-2xl font-semibold tracking-[-0.04em]'>
                Turn your next link into a little bit of magic.
              </h3>
              <AuthCta
                label='Get started today'
                className={btnPrimary}
                icon={<ArrowRightIcon size={16} weight='bold' />}
              />
            </div>
          </article>
        </div>

        <Marquee />

        <div className='mt-10 flex flex-col gap-16 md:mt-16 md:gap-24'>
          <div className='flex flex-col items-center gap-5 text-center'>
            <p className={sectionLabel}>The details</p>
            <h2
              className={`${heading} max-w-3xl text-balance text-4xl font-bold leading-[1.05] md:text-6xl`}
            >
              More{" "}
              <i className='text-fuchsia-600 dark:text-fuchsia-400'>magic</i>{" "}
              you&apos;ll use every day
            </h2>
          </div>

          <div className='relative border-t border-zinc-900/10 dark:border-white/10'>
            <CornerDot className='-left-1 -top-1' />
            <CornerDot className='-right-1 -top-1' />
            <CornerDot className='-bottom-1 -left-1' />
            <CornerDot className='-bottom-1 -right-1' />
            <div className='grid md:grid-cols-2'>
              {details.map((detail, index) => (
                <div
                  key={detail.name}
                  className={`flex gap-5 border-b border-zinc-900/10 px-2 py-8 dark:border-white/10 sm:px-6 md:px-10 md:py-10 ${
                    index % 2 === 0 ? "md:border-r" : ""
                  }`}
                >
                  <div className='flex w-14 shrink-0 justify-center pt-0.5'>
                    {detail.keys ? (
                      <span className='flex gap-1.5'>
                        {detail.keys.map((key) => (
                          <kbd
                            key={key}
                            className='grid h-10 min-w-10 place-items-center rounded-lg border border-zinc-900/10 bg-white px-2 font-mono text-sm font-semibold text-zinc-800 shadow-[0_3px_0_rgba(24,24,27,0.1)] dark:border-white/15 dark:bg-zinc-900 dark:text-zinc-100 dark:shadow-[0_3px_0_rgba(255,255,255,0.08)]'
                          >
                            {key}
                          </kbd>
                        ))}
                      </span>
                    ) : (
                      <detail.icon
                        size={44}
                        weight='duotone'
                        className='text-fuchsia-600 dark:text-fuchsia-400'
                      />
                    )}
                  </div>
                  <div>
                    <h3
                      className={`${heading} text-lg font-semibold tracking-[-0.02em] md:text-xl`}
                    >
                      {detail.name}
                    </h3>
                    <p className={`${body} mt-1.5 leading-relaxed`}>
                      {detail.copy}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;

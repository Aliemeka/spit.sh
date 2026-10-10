import MagicLinkForm from "@/components/forms/MagicLinkForm";
import AnimatedCircle from "@/components/illustrations/AnimatedCircle";
import AnimatedSquare from "@/components/illustrations/AnimatedSquare";
import Meditating from "@/components/illustrations/Meditating";
import AuthCta from "@/components/units/AuthCta";
import {
  ArrowRightIcon,
  GithubLogoIcon,
  MagicWandIcon,
  SparkleIcon,
} from "@phosphor-icons/react/dist/ssr";
import React from "react";
import {
  band,
  body,
  btnPrimary,
  btnSecondary,
  container,
  heading,
} from "./tokens";

const floatingShapes = [
  {
    shape: AnimatedSquare,
    size: 18,
    position: "left-[22%] top-[14%]",
    delay: "0s",
    rotation: 12,
  },
  {
    shape: AnimatedCircle,
    size: 14,
    position: "left-[33%] top-[2%]",
    delay: "0.4s",
  },
  {
    shape: AnimatedSquare,
    size: 12,
    position: "left-[46%] -top-[4%]",
    delay: "0.9s",
    rotation: -18,
  },
  {
    shape: AnimatedCircle,
    size: 20,
    position: "right-[33%] top-[1%]",
    delay: "0.2s",
  },
  {
    shape: AnimatedSquare,
    size: 16,
    position: "right-[22%] top-[12%]",
    delay: "0.7s",
    rotation: 24,
  },
  {
    shape: AnimatedCircle,
    size: 12,
    position: "left-[14%] top-[30%]",
    delay: "1.1s",
  },
  {
    shape: AnimatedCircle,
    size: 16,
    position: "right-[13%] top-[28%]",
    delay: "1.3s",
  },
];

const Hero = () => {
  return (
    <section className={band}>
      <div
        className={`${container} flex flex-col gap-16 pb-24 pt-12 md:gap-20 md:pb-28 md:pt-20`}
      >
        <div className='flex flex-col items-center gap-12 text-center md:gap-16'>
          <div className='flex flex-col items-center gap-6'>
            <span className='inline-flex items-center gap-1.5 rounded-full border border-fuchsia-500/20 bg-fuchsia-50 px-3 py-1 text-xs font-semibold text-fuchsia-700 dark:bg-fuchsia-500/10 dark:text-fuchsia-300'>
              <SparkleIcon size={14} weight='fill' />
              New: dynamic links &amp; pages
            </span>
            <h1
              className={`${heading} max-w-4xl text-balance text-[44px] font-bold leading-[1.05] md:text-[72px]`}
            >
              Shorter URLs with extra{" "}
              <span className='italic text-fuchsia-600 dark:text-fuchsia-500'>
                magic
              </span>
              🪄
            </h1>
            <p className={`${body} max-w-[46ch] text-lg leading-relaxed`}>
              Unleash the magic: Get better leads and conversions out of your
              links with analytics and tracking.
            </p>
            <div className='flex w-full flex-col justify-center gap-4 sm:gap-5 sm:w-auto sm:flex-row'>
              <AuthCta
                className={btnPrimary}
                icon={<ArrowRightIcon size={16} weight='bold' />}
              />
              <a
                href='https://github.com/aliemeka/spit.sh'
                target='_blank'
                className={btnSecondary}
              >
                <GithubLogoIcon size={18} weight='fill' />
                Star on GitHub
              </a>
            </div>
          </div>

          <div className='relative w-full max-w-2xl text-zinc-900 dark:text-zinc-200 [&>svg]:h-auto [&>svg]:w-full'>
            {floatingShapes.map(
              ({ shape: Shape, size, position, delay, rotation }, index) => (
                <span
                  key={index}
                  aria-hidden
                  className={`absolute animate-bounce-soft motion-reduce:animate-none ${position}`}
                  style={{ animationDelay: delay }}
                >
                  <Shape
                    size={size}
                    strokeWidth={6}
                    rotation={rotation}
                    style={{ ["--shape-delay" as string]: delay }}
                  />
                </span>
              ),
            )}
            <Meditating />
          </div>
        </div>

        <div className='grid gap-8 md:grid-cols-[1fr_1px_1fr] md:gap-12'>
          <div className='flex flex-col items-start gap-4'>
            <span className='grid h-11 w-11 place-items-center rounded-2xl border border-zinc-900/10 bg-white text-fuchsia-600 dark:border-white/10 dark:bg-zinc-900 dark:text-fuchsia-400'>
              <MagicWandIcon size={20} />
            </span>
            <h2 className={`${heading} text-[22px] font-semibold`}>
              Create a magic link ✨
            </h2>
            <MagicLinkForm
              className='max-w-md'
              formClassName='rounded-2xl'
              buttonClassName='rounded-xl'
            />
          </div>
          <div className='h-px bg-zinc-900/10 dark:bg-white/10 md:h-auto' />
          <div className='flex flex-col items-start gap-4'>
            <span className='grid h-11 w-11 place-items-center rounded-2xl border border-zinc-900/10 bg-white text-fuchsia-600 dark:border-white/10 dark:bg-zinc-900 dark:text-fuchsia-400'>
              <GithubLogoIcon size={20} />
            </span>
            <h2 className={`${heading} text-[22px] font-semibold`}>
              Open-source, all the way down 🤯
            </h2>
            <p className={`${body} max-w-[52ch] leading-relaxed`}>
              Step into a world of magic and efficiency as you create shorter
              links with Spit.sh, empowering your online presence. Read the
              code, self-host it, or send a pull request.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

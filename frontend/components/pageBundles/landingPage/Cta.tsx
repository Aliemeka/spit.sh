import AnimatedCircle from "@/components/illustrations/AnimatedCircle";
import AnimatedTriangle from "@/components/illustrations/AnimatedTriangle";
import CopyCommand from "@/components/units/CopyCommand";
import { GithubLogoIcon } from "@phosphor-icons/react/dist/ssr";
import { container } from "@/components/pageBundles/landingPage/tokens";

const Cta = () => {
  return (
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
            Spit.sh is <span className='text-fuchsia-400'>open-source</span> 🤯
          </h2>
          <p className='text-lg leading-relaxed'>
            Step into a world of magic and efficiency as you create shorter
            links with Spit.sh, empowering your online presence.
          </p>
          <CopyCommand command='git clone https://github.com/aliemeka/spit.sh' />
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
  );
};

export default Cta;

import AuthCta from "@/components/units/AuthCta";
import { CaretDownIcon, CheckIcon } from "@phosphor-icons/react/dist/ssr";
import {
  band,
  body,
  btnGhost,
  btnPrimary,
  card,
  container,
  heading,
  sectionLabel,
} from "./tokens";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    blurb: "Everything you need to start casting short links.",
    cta: "Get started for free",
    features: [
      "30 links / month",
      "5,000 tracked clicks / month",
      "1 seat",
      "30-day analytics history",
      "QR codes, tags & UTM parameters",
    ],
  },
  {
    name: "Pro",
    price: "$15",
    period: "per project / month",
    blurb: "For growing teams who want their brand on every link.",
    cta: "Start 14-day free trial",
    featured: true,
    features: [
      "1,000 links / month",
      "50,000 tracked clicks / month",
      "10 seats",
      "3 custom domains",
      "Dynamic links with geo & device targeting",
      "365-day analytics history",
      "Password & expiring links",
      "CSV export & bulk import",
      "Priority support",
    ],
  },
  {
    name: "Business",
    price: "Soon",
    period: "coming later",
    blurb: "For teams running links at serious scale.",
    cta: "Coming soon",
    disabled: true,
    features: [
      "10,000+ links / month",
      "500,000+ tracked clicks / month",
      "25+ seats",
      "Dynamic links with geo & device targeting",
      "Referral programs & affiliate links",
      "Unlimited analytics history",
      "Priority support with SLA",
    ],
  },
];

const faqs = [
  {
    q: "Is Spit.sh really free?",
    a: "Yes. The Free plan gives you 30 links and 5,000 tracked clicks every month, forever. Upgrade a project to Pro only when you need more.",
  },
  {
    q: "Can I use my own domain?",
    a: "Pro projects can connect up to 3 custom domains, so your short links carry your brand instead of ours.",
  },
  {
    q: "What are dynamic links?",
    a: "A dynamic link sends each visitor to a different destination depending on their device or country. One link can open the App Store on iPhone, Google Play on Android and your website everywhere else.",
  },
  {
    q: "What are Pages?",
    a: "Pages are link-in-bio pages you build inside Spit.sh. Collect your links, socials and launches on one page and track every click on it.",
  },
  {
    q: "Will my links break if I go over my limit or downgrade?",
    a: "Never. Redirects keep working no matter what plan a project is on or how far over its limits it is. You just won't be able to create new links until the next period.",
  },
  {
    q: "Is Spit.sh open-source?",
    a: "All of it. The code lives on GitHub, so you can read it, self-host it or contribute.",
  },
];

const Pricing = () => {
  return (
    <>
      <section id='pricing' className={`${band} scroll-mt-20 py-24 md:py-28`}>
        <div className={`${container} flex flex-col gap-12`}>
          <div className='mx-auto flex max-w-2xl flex-col items-center gap-4 text-center'>
            <p className={sectionLabel}>/Pricing</p>
            <h2
              className={`${heading} text-balance text-3xl font-bold leading-tight md:text-5xl`}
            >
              Pick your level of{" "}
              <i className='text-fuchsia-600 dark:text-fuchsia-500'>magic</i>👌🏽
            </h2>
            <p className={`${body} text-lg`}>
              Billed per project. Pay in USD or NGN. Cancel any time.
            </p>
          </div>

          <div className='grid gap-4 lg:grid-cols-3'>
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={`${card} relative flex flex-col gap-6 p-6 md:p-8 ${
                  plan.featured
                    ? "!border-fuchsia-500/40 ring-4 ring-fuchsia-500/10"
                    : ""
                }`}
              >
                {plan.featured ? (
                  <span className='absolute right-6 top-6 rounded-full bg-fuchsia-600 px-2.5 py-1 text-[11px] font-semibold text-white dark:bg-fuchsia-500'>
                    Most popular
                  </span>
                ) : null}
                <div>
                  <h3 className={`${heading} text-lg font-semibold`}>
                    {plan.name}
                  </h3>
                  <p className={`${body} mt-1 text-sm`}>{plan.blurb}</p>
                </div>
                <p className='flex items-baseline gap-2'>
                  <span className={`${heading} text-5xl font-bold`}>
                    {plan.price}
                  </span>
                  <span className='text-sm text-zinc-500'>{plan.period}</span>
                </p>
                {plan.disabled ? (
                  <span className={`${btnGhost} cursor-not-allowed opacity-60`}>
                    {plan.cta}
                  </span>
                ) : (
                  <AuthCta
                    label={plan.cta}
                    className={plan.featured ? btnPrimary : btnGhost}
                  />
                )}
                <ul className='flex flex-col gap-3 border-t border-zinc-900/10 pt-6 dark:border-white/10'>
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className='flex items-start gap-2.5 text-sm text-zinc-700 dark:text-zinc-300'
                    >
                      <CheckIcon
                        size={16}
                        weight='bold'
                        className='mt-0.5 shrink-0 text-fuchsia-600 dark:text-fuchsia-400'
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id='faq' className='scroll-mt-20 py-24 md:py-28'>
        <div
          className={`${container} grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-20`}
        >
          <div className='flex flex-col gap-4'>
            <p className={sectionLabel}>/FAQ</p>
            <h2
              className={`${heading} text-balance text-3xl font-bold leading-tight md:text-5xl`}
            >
              Questions, answered.
            </h2>
            <p className={`${body} text-lg`}>
              Still curious?{" "}
              <a
                href='https://github.com/aliemeka/spit.sh/issues'
                target='_blank'
                className='font-medium text-fuchsia-600 underline-offset-4 hover:underline dark:text-fuchsia-400'
              >
                Open an issue on GitHub
              </a>
              .
            </p>
          </div>
          <div
            className={`${card} divide-y divide-zinc-900/10 dark:divide-white/10`}
          >
            {faqs.map((faq) => (
              <details key={faq.q} className='group p-6'>
                <summary className='flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-zinc-900 dark:text-zinc-50 [&::-webkit-details-marker]:hidden'>
                  {faq.q}
                  <CaretDownIcon
                    size={18}
                    className='shrink-0 text-zinc-500 transition group-open:rotate-180'
                  />
                </summary>
                <p className={`${body} mt-3 text-sm leading-relaxed`}>
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Pricing;

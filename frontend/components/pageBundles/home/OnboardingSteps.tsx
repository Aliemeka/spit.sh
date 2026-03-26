import { CheckCircleIcon, CircleIcon } from "@phosphor-icons/react/dist/ssr";
import { getProjectLinksAction } from "@/app/actions/link";

const steps = [
  { label: "Create profile" },
  { label: "Create a workspace" },
  { label: "Create a link" },
  { label: "Upgrade to Pro" },
];

interface Props {
  projectSlug: string;
}

const OnboardingSteps = async ({ projectSlug }: Props) => {
  let links: unknown[] = [];
  try {
    links = await getProjectLinksAction(projectSlug, { limit: 1 });
  } catch {
    // If fetching links fails (e.g. missing/expired session), fall back to no links
    links = [];
  }
  const done = [true, true, links.length > 0, false];

  return (
    <div className='rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6'>
      <p className='text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4'>
        Getting started
      </p>
      <ul className='space-y-3'>
        {steps.map((step, i) => (
          <li key={step.label} className='flex items-center gap-3'>
            {done[i] ? (
              <CheckCircleIcon
                size={18}
                weight='fill'
                className='text-fuchsia-500 shrink-0'
              />
            ) : (
              <CircleIcon
                size={18}
                weight='regular'
                className='text-zinc-300 dark:text-zinc-600 shrink-0'
              />
            )}
            <span
              className={`text-sm ${
                done[i]
                  ? "text-zinc-400 dark:text-zinc-500 line-through"
                  : "text-zinc-700 dark:text-zinc-300"
              }`}
            >
              {step.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OnboardingSteps;

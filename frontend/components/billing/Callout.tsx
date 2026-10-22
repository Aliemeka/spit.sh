import { FC, ReactNode } from "react";
import {
  InfoIcon,
  WarningCircleIcon,
  WarningIcon,
} from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

export type CalloutTone = "info" | "warning" | "danger";

const toneStyles: Record<CalloutTone, string> = {
  info: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-900 dark:border-fuchsia-900/60 dark:bg-fuchsia-950/30 dark:text-fuchsia-100",
  warning:
    "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100",
  danger:
    "border-red-200 bg-red-50 text-red-900 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-100",
};

const toneIcons: Record<CalloutTone, ReactNode> = {
  info: <InfoIcon size={20} weight='fill' className='text-fuchsia-600' />,
  warning: <WarningIcon size={20} weight='fill' className='text-amber-500' />,
  danger: (
    <WarningCircleIcon size={20} weight='fill' className='text-red-500' />
  ),
};

const Callout: FC<{
  tone: CalloutTone;
  title: string;
  children: ReactNode;
  action?: ReactNode;
}> = ({ tone, title, children, action }) => (
  <div className={cn("flex gap-3 rounded-xl border p-4", toneStyles[tone])}>
    <span className='mt-0.5 shrink-0'>{toneIcons[tone]}</span>
    <div className='space-y-3'>
      <div className='space-y-1'>
        <p className='text-sm font-semibold'>{title}</p>
        <p className='text-sm opacity-80'>{children}</p>
      </div>
      {action}
    </div>
  </div>
);

export default Callout;

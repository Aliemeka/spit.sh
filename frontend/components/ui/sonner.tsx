"use client";
import {
  CheckCircle,
  Info,
  LoaderIcon,
  XOctagon,
  AlertTriangle,
} from "lucide-react";
import { Toaster as Sonner } from "sonner";
import { PlusJakartaSans } from "@/lib/font";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className='toaster group'
      style={PlusJakartaSans.style}
      icons={{
        success: <CheckCircle className='h-4 w-4' />,
        info: <Info className='h-4 w-4' />,
        warning: <AlertTriangle className='h-4 w-4' />,
        error: <XOctagon className='h-4 w-4' />,
        loading: <LoaderIcon className='h-4 w-4 animate-spin' />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group-[.toaster]:bg-white group-[.toaster]:text-zinc-700 group-[.toaster]:border-zinc-200 group-[.toaster]:shadow-md dark:group-[.toaster]:bg-zinc-900 dark:group-[.toaster]:text-zinc-100 dark:group-[.toaster]:border-zinc-800",
          description:
            "group-[.toast]:text-zinc-500 dark:group-[.toast]:text-zinc-400",
          actionButton:
            "group-[.toast]:bg-zinc-900 group-[.toast]:text-white dark:group-[.toast]:bg-zinc-100 dark:group-[.toast]:text-zinc-900",
          cancelButton:
            "group-[.toast]:bg-zinc-100 group-[.toast]:text-zinc-600 dark:group-[.toast]:bg-zinc-800 dark:group-[.toast]:text-zinc-400",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };

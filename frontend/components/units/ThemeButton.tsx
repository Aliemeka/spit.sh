"use client";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useTheme } from "next-themes";
import {
  CheckIcon,
  DesktopIcon,
  MoonIcon,
  SunIcon,
} from "@phosphor-icons/react";

const themes = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "System", icon: DesktopIcon },
];

const ThemeButton = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const current = themes.find((item) => item.value === theme) ?? themes[2];
  const TriggerIcon = mounted ? current.icon : DesktopIcon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='grid h-9 w-9 place-items-center rounded-xl text-zinc-700 transition hover:bg-zinc-900/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500/40 dark:text-zinc-300 dark:hover:bg-white/10'>
        <TriggerIcon size={20} />
        <span className='sr-only'>Switch theme</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        sideOffset={8}
        className='min-w-[10rem] rounded-xl border-zinc-900/10 bg-white p-1.5 dark:border-white/10 dark:bg-zinc-900'
      >
        {themes.map(({ value, label, icon: Icon }) => (
          <DropdownMenuItem
            key={value}
            onSelect={() => setTheme(value)}
            className='flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm'
          >
            <Icon size={16} />
            <span className='flex-1'>{label}</span>
            {mounted && theme === value ? (
              <CheckIcon
                size={14}
                weight='bold'
                className='text-fuchsia-600 dark:text-fuchsia-400'
              />
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeButton;

"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useTheme } from "next-themes";
import { SunIcon } from "lucide-react";
import MoonIcon from "../icons/MoonIcon";
import MonitorIcon from "../icons/MonitorIcon";
import { cn } from "@/lib/utils";

const ThemeButton = () => {
  const { setTheme, resolvedTheme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className=''>
          {resolvedTheme === "light" ? <SunIcon /> : <MoonIcon />}
        </div>
        <span className='sr-only'>Switch theme</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='bg-zinc-100 dark:bg-zinc-900'>
        <DropdownMenuLabel className='font-normal'>
          <button
            onClick={() => setTheme("light")}
            className='flex items-start gap-x-1 w-full'
          >
            <SunIcon /> <p>Light</p>
          </button>
        </DropdownMenuLabel>
        <DropdownMenuLabel className='font-normal'>
          <button
            onClick={() => setTheme("dark")}
            className='flex items-start gap-x-1 w-full'
          >
            <MoonIcon /> <p>Dark</p>
          </button>
        </DropdownMenuLabel>
        <DropdownMenuLabel className='font-normal'>
          <button
            onClick={() => setTheme("system")}
            className={cn("flex items-start gap-x-1 w-full")}
          >
            <MonitorIcon /> <p>System</p>
          </button>
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeButton;

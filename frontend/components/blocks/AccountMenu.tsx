"use client";

import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowsLeftRightIcon,
  CaretUpDownIcon,
  SignOutIcon,
  UserIcon,
} from "@phosphor-icons/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { workspaceRoutes } from "@/lib/constants/routes";

interface Props {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  onLogout: () => void;
}

const itemClass = "cursor-pointer gap-2.5 px-3 py-2";

const AccountMenu: FC<Props> = ({ name, email, image, onLogout }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button
        type='button'
        className='flex w-full items-center gap-2 rounded-lg p-2 text-left transition bg-white dark:bg-slate-900 dark:text-slate-100 hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500/40 data-[state=open]:bg-zinc-100 dark:hover:bg-zinc-800 dark:data-[state=open]:bg-zinc-800'
      >
        <Image
          alt={name ?? "User"}
          src={
            image ??
            `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${encodeURIComponent(email ?? "user")}`
          }
          className='shrink-0 rounded-full object-cover'
          height={40}
          width={40}
        />
        <p className='min-w-0 flex-1 text-xs'>
          <strong className='block truncate font-medium'>{name ?? "—"}</strong>
          <span className='block truncate text-zinc-500 dark:text-zinc-400'>
            {email}
          </span>
        </p>
        <CaretUpDownIcon
          size={16}
          className='shrink-0 text-zinc-500 dark:text-zinc-400'
        />
      </button>
    </DropdownMenuTrigger>

    <DropdownMenuContent
      side='top'
      align='start'
      sideOffset={8}
      className='w-[var(--radix-dropdown-menu-trigger-width)] rounded-lg p-1.5'
    >
      <DropdownMenuItem className={itemClass}>
        <UserIcon size={16} />
        Profile settings
      </DropdownMenuItem>
      <DropdownMenuItem asChild className={itemClass}>
        <Link href={workspaceRoutes.index}>
          <ArrowsLeftRightIcon size={16} />
          Change workspace
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onSelect={onLogout} className={itemClass}>
        <SignOutIcon size={16} />
        Log out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export default AccountMenu;

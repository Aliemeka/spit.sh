"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { deleteUserCookie } from "@/app/actions/auth";

export default function DashboardHomeNavbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await Promise.all([signOut(), deleteUserCookie()]);
    window.location.href = "/signin";
  };

  const avatarSrc =
    session?.user.image ??
    `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${encodeURIComponent(
      session?.user.email ?? "user"
    )}`;

  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-zinc-800">
      <Link href="/dashboard" className="font-bold text-2xl tracking-tight text-white">
        Spit<span className="text-fuchsia-500">.sh</span>
      </Link>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <Image
            alt={session?.user.name ?? "User"}
            src={avatarSrc}
            className="rounded-full object-cover"
            height={36}
            width={36}
            unoptimized
          />
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium leading-none">
              {session?.user.name ?? session?.user.email ?? "—"}
            </p>
            <p className="text-xs text-zinc-400 mt-0.5">{session?.user.email}</p>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 text-zinc-400 transition-transform ${open ? "rotate-180" : ""}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-44 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-50 overflow-hidden">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2.5 text-sm text-left text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

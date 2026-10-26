"use client";

import { createContext, ReactNode, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { workspaceCookieName } from "@/lib/constants/cookies";

interface WorkspaceContextValue {
  slug: string;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

const readCookie = (name: string) => {
  const match = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : undefined;
};

export function WorkspaceProvider({
  slug,
  userId,
  children,
}: {
  slug: string;
  userId: string;
  children: ReactNode;
}) {
  const router = useRouter();

  // Another tab may have switched workspace while this one was in the background
  useEffect(() => {
    const cookieName = workspaceCookieName(userId);
    let lastSeen = readCookie(cookieName);

    const handleVisibility = () => {
      if (document.visibilityState !== "visible") return;
      const current = readCookie(cookieName);
      if (current === lastSeen) return;
      lastSeen = current;
      if (current && current !== slug) router.refresh();
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [userId, slug, router]);

  return (
    <WorkspaceContext.Provider value={{ slug }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used inside WorkspaceProvider");
  }
  return context;
}

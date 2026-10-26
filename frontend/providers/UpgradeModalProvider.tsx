"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import UpgradeModal, { UpgradeReason } from "@/components/billing/UpgradeModal";

interface UpgradeModalContextValue {
  openUpgradeModal: (reason?: UpgradeReason) => void;
}

const UpgradeModalContext = createContext<UpgradeModalContextValue | null>(
  null,
);

export function UpgradeModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<UpgradeReason | undefined>();

  const openUpgradeModal = (nextReason?: UpgradeReason) => {
    setReason(nextReason);
    setOpen(true);
  };

  return (
    <UpgradeModalContext.Provider value={{ openUpgradeModal }}>
      {children}
      <UpgradeModal
        open={open}
        reason={reason}
        onOpenChange={setOpen}
      />
    </UpgradeModalContext.Provider>
  );
}

export function useUpgradeModal() {
  const context = useContext(UpgradeModalContext);
  if (!context) {
    throw new Error("useUpgradeModal must be used inside UpgradeModalProvider");
  }
  return context;
}

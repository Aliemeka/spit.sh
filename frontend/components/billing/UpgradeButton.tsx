"use client";

import { FC } from "react";
import { usePathname } from "next/navigation";
import { CrownIcon } from "@phosphor-icons/react";
import { useBilling } from "@/hooks/useBilling";
import { useUpgradeModal } from "@/providers/UpgradeModalProvider";
import { dashboardRoutes } from "@/lib/constants/routes";

const UpgradeButton: FC = () => {
  const pathname = usePathname();
  const { billing } = useBilling();
  const { openUpgradeModal } = useUpgradeModal();

  if (
    !billing ||
    billing.tier !== "free" ||
    pathname === dashboardRoutes.billing
  ) {
    return null;
  }

  return (
    <button
      type='button'
      onClick={() => openUpgradeModal()}
      className='inline-flex items-center gap-1.5 rounded-full bg-fuchsia-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-fuchsia-700 active:bg-fuchsia-800'
    >
      <CrownIcon size={14} weight='fill' />
      Upgrade to Pro
    </button>
  );
};

export default UpgradeButton;

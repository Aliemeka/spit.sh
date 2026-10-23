"use client";

import { Button } from "@/components/ui/button";
import { useUpgradeModal } from "@/providers/UpgradeModalProvider";

const UpgradePlanButton = () => {
  const { openUpgradeModal } = useUpgradeModal();

  return (
    <Button onClick={() => openUpgradeModal()} className='rounded-lg'>
      Upgrade
    </Button>
  );
};

export default UpgradePlanButton;

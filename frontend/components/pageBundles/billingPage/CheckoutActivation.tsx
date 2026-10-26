"use client";

import { FC, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { getBillingAction } from "@/app/actions/billing";
import Callout from "@/components/billing/Callout";
import { useToast } from "@/hooks/useToast";
import { useWorkspace } from "@/providers/WorkspaceProvider";

const POLL_MS = 2000;
const TIMEOUT_MS = 30000;

// Shown after returning from Bachs checkout. The webhook, not the redirect,
// activates the plan, so we poll until the tier changes.
const CheckoutActivation: FC<{ isPaid: boolean }> = ({ isPaid }) => {
  const { slug: projectSlug } = useWorkspace();
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { toastSuccess, toastNeutral } = useToast();
  const [activating, setActivating] = useState(!isPaid);

  useEffect(() => {
    const finish = (activated: boolean) => {
      setActivating(false);
      if (activated) toastSuccess("Your plan is active");
      else toastNeutral("Payment received. Your plan will update shortly.");
      queryClient.invalidateQueries({ queryKey: ["billing", projectSlug] });
      router.replace(pathname);
    };

    if (isPaid) {
      finish(true);
      return;
    }

    const interval = setInterval(async () => {
      try {
        const billing = await getBillingAction(projectSlug);
        if (billing.tier !== "free") {
          clearInterval(interval);
          clearTimeout(timeout);
          finish(true);
        }
      } catch {
        // Keep polling until the timeout.
      }
    }, POLL_MS);
    const timeout = setTimeout(() => {
      clearInterval(interval);
      finish(false);
    }, TIMEOUT_MS);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  if (!activating) return null;

  return (
    <Callout tone='info' title='Activating your plan…'>
      Payment received. This usually takes a few seconds.
    </Callout>
  );
};

export default CheckoutActivation;

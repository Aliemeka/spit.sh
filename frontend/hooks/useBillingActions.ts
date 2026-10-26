"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  openPortalAction,
  startCheckoutAction,
  switchToFreeAction,
} from "@/app/actions/billing";
import { BillingCurrency, PaymentTier } from "@/lib/types/billingTypes";
import { useToast } from "@/hooks/useToast";
import { useWorkspace } from "@/providers/WorkspaceProvider";

type PendingAction = "checkout" | "portal" | "switch" | null;

export function useBillingActions() {
  const { slug: projectSlug } = useWorkspace();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toastError, toastSuccess } = useToast();
  const [pending, setPending] = useState<PendingAction>(null);

  // Server-rendered billing UI updates through router.refresh(); client-side
  // users of useBilling (modal, nav) through the query cache.
  const refreshBilling = () => {
    queryClient.invalidateQueries({ queryKey: ["billing", projectSlug] });
    router.refresh();
  };

  const startCheckout = async (
    tier: PaymentTier,
    currency: BillingCurrency,
  ) => {
    setPending("checkout");
    try {
      const { checkout_url } = await startCheckoutAction(
        projectSlug,
        tier,
        currency,
      );
      window.location.href = checkout_url;
    } catch {
      toastError("Couldn't start checkout, try again");
      refreshBilling();
      setPending(null);
    }
  };

  const openPortal = async () => {
    setPending("portal");
    try {
      const { portal_url } = await openPortalAction(projectSlug);
      window.location.href = portal_url;
    } catch {
      toastError("Couldn't open billing, try again");
      setPending(null);
    }
  };

  const switchToFree = async () => {
    setPending("switch");
    try {
      await switchToFreeAction(projectSlug);
      toastSuccess("Switched to the Free plan");
    } catch {
      toastError("Couldn't switch to Free, try again");
    } finally {
      refreshBilling();
      setPending(null);
    }
  };

  return { startCheckout, openPortal, switchToFree, pending, refreshBilling };
}

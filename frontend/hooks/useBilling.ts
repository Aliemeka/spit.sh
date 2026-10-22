"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBillingAction } from "@/app/actions/billing";
import { BillingCurrency } from "@/lib/types/billingTypes";

export function useBilling(projectSlug: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["billing", projectSlug],
    queryFn: () => getBillingAction(projectSlug),
  });

  const can = (feature: string) => Boolean(data?.entitlements[feature]);

  return { billing: data, loading: isLoading, error, refetch, can };
}

// Bachs picks the real checkout currency; this only decides which price we display.
export function useDisplayCurrency(): BillingCurrency {
  const [currency, setCurrency] = useState(BillingCurrency.USD);

  useEffect(() => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timeZone === "Africa/Lagos") setCurrency(BillingCurrency.NGN);
  }, []);

  return currency;
}

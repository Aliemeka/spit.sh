"use server";

import axios from "axios";
import { API_URL } from "@/lib/config/public_env";
import { getSessionToken } from "./auth";
import {
  BillingCurrency,
  BillingState,
  PaymentTier,
} from "@/lib/types/billingTypes";

async function getToken() {
  const token = await getSessionToken();
  if (!token) throw new Error("Unauthorized");
  return token;
}

const billingUrl = (projectSlug: string) =>
  `${API_URL}/projects/${projectSlug}/billing`;

export async function getBillingAction(
  projectSlug: string,
): Promise<BillingState> {
  const token = await getToken();
  const res = await axios.get(billingUrl(projectSlug), {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function startCheckoutAction(
  projectSlug: string,
  tier: PaymentTier,
  currency: BillingCurrency,
): Promise<{ checkout_url: string }> {
  const token = await getToken();
  const res = await axios.post(
    `${billingUrl(projectSlug)}/checkout`,
    { tier, currency },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return res.data;
}

export async function openPortalAction(
  projectSlug: string,
): Promise<{ portal_url: string }> {
  const token = await getToken();
  const res = await axios.post(`${billingUrl(projectSlug)}/portal`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function switchToFreeAction(
  projectSlug: string,
): Promise<BillingState> {
  const token = await getToken();
  const res = await axios.post(
    `${billingUrl(projectSlug)}/switch-to-free`,
    null,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return res.data;
}

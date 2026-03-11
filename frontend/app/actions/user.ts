"use server";

import axios from "axios";
import { API_URL } from "@/lib/config/public_env";
import { getSessionToken } from "./auth";

export async function updateProfileAction(data: {
  first_name: string;
  last_name: string;
  image?: string;
}) {
  const token = await getSessionToken();
  if (!token) throw new Error("Unauthorized");
  const res = await axios.patch(`${API_URL}/users/me`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

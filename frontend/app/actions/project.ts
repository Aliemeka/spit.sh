"use server";

import axios from "axios";
import { API_URL } from "@/lib/config/public_env";
import { getSessionToken } from "./auth";

export async function getProjectsAction() {
  const token = await getSessionToken();
  if (!token) throw new Error("Unauthorized");
  const res = await axios.get(`${API_URL}/projects/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function createProjectAction(data: {
  name: string;
  slug: string;
  logo?: string;
}) {
  const token = await getSessionToken();
  if (!token) throw new Error("Unauthorized");
  const res = await axios.post(`${API_URL}/projects/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

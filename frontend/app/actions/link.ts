"use server";

import axios from "axios";
import { API_URL } from "@/lib/config/public_env";
import { getSessionToken } from "./auth";
import {
  LinkPayload,
  LinkQueryParams,
  LinkResponse,
} from "@/lib/types/linkTypes";

async function getToken() {
  const token = await getSessionToken();
  if (!token) throw new Error("Unauthorized");
  return token;
}

export async function getProjectLinksAction(
  projectSlug: string,
  filters?: Partial<LinkQueryParams>,
): Promise<LinkResponse[]> {
  const token = await getToken();
  const res = await axios.get(`${API_URL}/projects/${projectSlug}/links`, {
    headers: { Authorization: `Bearer ${token}` },
    params: filters,
  });
  return res.data.links;
}

export async function createProjectLinkAction(
  projectSlug: string,
  data: LinkPayload,
): Promise<LinkResponse> {
  const token = await getToken();
  const res = await axios.post(
    `${API_URL}/projects/${projectSlug}/links`,
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return res.data;
}

export async function updateProjectLinkAction(
  projectSlug: string,
  linkId: string,
  data: Partial<LinkPayload>,
): Promise<LinkResponse> {
  const token = await getToken();
  const res = await axios.patch(
    `${API_URL}/projects/${projectSlug}/links/${linkId}`,
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return res.data;
}

export async function deleteProjectLinkAction(
  projectSlug: string,
  linkId: string,
): Promise<void> {
  const token = await getToken();
  await axios.delete(`${API_URL}/projects/${projectSlug}/links/${linkId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

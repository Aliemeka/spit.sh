import axios from "axios";
import { API_URL } from "../config/public_env";
import { LinkPayload, LinkResponse } from "@/lib/types/linkTypes";

const linkUrl = API_URL + "/links";

export const createShortUrl = async (url: string, slug?: string) => {
  try {
    const res = await fetch(linkUrl + "/", {
      method: "POST",
      body: JSON.stringify({ url: url, slug: slug }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const getLinkUrl = async (slug: string) => {
  try {
    const res = await fetch(`${linkUrl}${slug}`, { method: "GET" });
    const data = await res.json();
    return data.url as string;
  } catch (error) {
    return undefined;
  }
};

export const getProjectLinks = async (
  projectSlug: string,
  token: string,
): Promise<LinkResponse[]> => {
  const res = await axios.get(`${API_URL}/projects/${projectSlug}/links`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.links;
};

export const createProjectLink = async (
  projectSlug: string,
  data: LinkPayload,
  token: string,
): Promise<LinkResponse> => {
  const res = await axios.post(`${API_URL}/projects/${projectSlug}/links`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateProjectLink = async (
  projectSlug: string,
  linkId: string,
  data: Partial<LinkPayload>,
  token: string,
): Promise<LinkResponse> => {
  const res = await axios.patch(
    `${API_URL}/projects/${projectSlug}/links/${linkId}`,
    data,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return res.data;
};

export const deleteProjectLink = async (
  projectSlug: string,
  linkId: string,
  token: string,
): Promise<void> => {
  await axios.delete(`${API_URL}/projects/${projectSlug}/links/${linkId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

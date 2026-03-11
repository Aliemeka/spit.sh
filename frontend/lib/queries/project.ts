import axios from "axios";
import { API_URL } from "@/lib/config/public_env";

export const createProject = async (
  data: { name: string; slug: string; logo?: string },
  token: string,
) => {
  const res = await axios.post(`${API_URL}/projects/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getProjects = async (token: string) => {
  const res = await axios.get(`${API_URL}/projects/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

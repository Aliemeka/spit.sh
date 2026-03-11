import axios from "axios";
import { API_URL } from "@/lib/config/public_env";

export const getProfile = async (token: string) => {
  const res = await axios.get(`${API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateProfile = async (
  data: { first_name: string; last_name: string; image?: string },
  token: string
) => {
  const res = await axios.patch(`${API_URL}/users/me`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

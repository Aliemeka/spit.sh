import { API_URL } from "../config/environment";

const linkUrl = API_URL + "/links";

export const createShortUrl = async (url: string, slug?: string) => {
  try {
    console.log(linkUrl);
    console.log(JSON.stringify({ url: url, slug: slug }));

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

import { API_URL } from "../config/environment";

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
    console.log("Called!");
    const res = await fetch(`${linkUrl}${slug}`, { method: "GET" });
    const data = await res.json();
    console.log("data", JSON.stringify(data));
    return data.url as string;
  } catch (error) {
    console.log(JSON.stringify(error));
    return undefined;
  }
};

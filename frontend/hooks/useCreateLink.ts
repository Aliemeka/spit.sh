import { createShortUrl } from "@/lib/queries/link";
import { useState } from "react";

const useCreateLink = () => {
  const [creating, setCreating] = useState(false);
  const [shortenedLink, setShortenedLink] = useState("");

  const handleCreateLink = async (url: string) => {
    try {
      setCreating(true);
      setShortenedLink("");
      const data = await createShortUrl(url);
      setShortenedLink(data.shortenUrl);
    } catch (error) {
      console.log(error);
    } finally {
      setCreating(false);
    }
  };
  return {
    creating,
    handleCreateLink,
    shortenedLink,
  };
};

export default useCreateLink;

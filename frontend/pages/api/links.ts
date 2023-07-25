// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createShortUrl } from "@/lib/queries/link";
import type { NextApiRequest, NextApiResponse } from "next";

type SlugData = {
  discount: number;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "POST":
      const { url, slug } = req.body;
      const result = await createShortUrl(url, slug);
      res.status(201).json(result);
      break;

    default:
      res.status(405).send("Method not allowed");
  }
};

import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

type Data = {
  status: number;
  message?: string;
  error?: string;
  data?: {};
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    return res.status(500).json({
      status: 5000,
      message: "No route for mehtod " + req.method + " found",
    });
  }

  const body = req.body;
  if (body.url === null || typeof body.url !== "string") {
    return res
      .status(500)
      .json({ status: 5000, message: "Invalid params given." });
  }

  if (!isValidUrl(body.url)) {
    return res.status(500).json({
      status: 5000,
      error: `${body.url} is not a valid url. Please correct your input.`,
    });
  }

  const prisma = new PrismaClient();

  let shrtLink = await prisma.shortLink.findFirst({
    where: {
      url: body.url,
    },
  });

  if (shrtLink) {
    return res.json({
      status: 2040,
      message: `Shortlink already exists`,
      data: shrtLink,
    });
  }

  const slug = Math.random().toString(36).substring(2);
  shrtLink = await prisma.shortLink.create({
    data: {
      slug: slug,
      url: body.url,
    },
  });

  return res.json({
    status: 2000,
    data: shrtLink,
  });
}

function isValidUrl(urlString: string): boolean {
  var urlPattern = new RegExp(
    "^(https?:\\/\\/){1}" + // validate protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  );
  return urlPattern.test(urlString);
}

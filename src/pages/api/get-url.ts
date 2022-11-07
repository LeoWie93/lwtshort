import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { networkInterfaces } from "os";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res
      .status(500)
      .json({ message: "No route for mehtod " + req.method + " found" });
  }

  const body = req.body;
  if (body.slug === null || typeof body.slug !== "string") {
    return res.status(500).json({ message: "Invalid params given." });
  }

  const prisma = new PrismaClient();
  let shrtLink = await prisma.shortLink.findUnique({
    where: {
      slug: body.slug,
    },
  });

  if (shrtLink) {
    shrtLink = await prisma.shortLink.update({
      where: {
        id: shrtLink.id,
      },
      data: {
        clicked: shrtLink.clicked + 1,
        lastTimeClicked: new Date(),
      },
    });
  }

  return res.status(200).json(shrtLink);
}

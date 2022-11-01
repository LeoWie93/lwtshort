import { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    return res
      .status(500)
      .json({ message: "No route for mehtod " + req.method + " found" });
  }

  const body = req.body;
  if (body.url === null || typeof body.url !== "string") {
    return res.status(500).json({ message: "Invalid params given." });
  }

  // check if already in storage
  // if yes: send message with shrtlink

  // gen short link
  // save into storage
  //return message withshrtlink
}

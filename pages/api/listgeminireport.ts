import { NextApiRequest, NextApiResponse } from "next";

// Placeholder API: returns a simple mocked analysis for the uploaded report/audio.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { base64 } = req.body;

  // Avoid storing large payloads in memory; just echo a prefix for debugging.
  const preview = typeof base64 === "string" ? base64.slice(0, 24) : "";

  res.status(200).json({
    success: true,
    analysis: `Mock analysis: received file data prefix: ${preview}. Replace this with a real AI model response in the backend.`,
  });
}

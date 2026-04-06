import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { audioBase64, language } = req.body;

  // Placeholder: backend should transcribe and analyze audio content.
  const preview = typeof audioBase64 === "string" ? audioBase64.slice(0, 24) : "";
  res.status(200).json({
    success: true,
    analysis: `Placeholder transcription for audio in ${language}. Received data prefix: ${preview}`,
  });
}

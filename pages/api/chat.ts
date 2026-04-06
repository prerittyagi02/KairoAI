import { NextApiRequest, NextApiResponse } from "next";
import { generateDoctorReply } from "@/lib/doctor-chat";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    res.status(500).json({
      message: "Missing GOOGLE_GENERATIVE_AI_API_KEY in server environment.",
    });
    return;
  }

  const { message, language, context } = req.body as {
    message?: string;
    language?: string;
    context?: string;
  };

  if (!message || !message.trim()) {
    res.status(400).json({ message: "message is required" });
    return;
  }

  try {
    const reply = await generateDoctorReply({
      userMessage: message.trim(),
      language,
      context,
    });

    res.status(200).json({ success: true, response: reply });
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Unable to generate AI response right now.",
    });
  }
}

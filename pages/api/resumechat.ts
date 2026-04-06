import { NextApiRequest, NextApiResponse } from "next";
import { streamDoctorReply } from "@/lib/doctor-chat";

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

  const { messages, data } = req.body as {
    messages?: Array<{ role?: string; content?: string }>;
    data?: { reportData?: string };
  };

  const normalizedMessages = Array.isArray(messages)
    ? messages
        .map((m) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: typeof m.content === "string" ? m.content : "",
        }))
        .filter((m) => m.content.trim().length > 0)
    : [];

  const lastUserMessage =
    [...normalizedMessages].reverse().find((m) => m.role === "user")?.content || "";

  if (!lastUserMessage) {
    res.status(400).json({ message: "No user message provided." });
    return;
  }

  const reportContext =
    typeof data?.reportData === "string" && data.reportData.trim().length > 0
      ? `Medical report data from user:\n${data.reportData.slice(0, 12000)}`
      : "No report data provided.";

  try {
    const result = streamDoctorReply({
      userMessage: lastUserMessage,
      context: reportContext,
      conversation: normalizedMessages as Array<{ role: "user" | "assistant"; content: string }>,
    });

    result.pipeDataStreamToResponse(res, {
      sendReasoning: false,
      getErrorMessage: (error) =>
        error instanceof Error
          ? error.message
          : "Unable to generate AI response right now.",
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Unable to generate AI response right now.",
      error: true,
    });
  }
}

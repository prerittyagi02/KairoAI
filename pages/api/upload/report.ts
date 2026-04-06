import { NextApiRequest, NextApiResponse } from "next";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

const languageMap: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  ta: "Tamil",
  te: "Telugu",
  bn: "Bengali",
  mr: "Marathi",
  gu: "Gujarati",
  pa: "Punjabi",
  ml: "Malayalam",
  kn: "Kannada",
};

function parseDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!match) return null;
  return {
    mimeType: match[1],
    base64: match[2],
  };
}

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

  const { fileBase64, language } = req.body as {
    fileBase64?: string;
    language?: string;
  };

  if (!fileBase64 || typeof fileBase64 !== "string") {
    res.status(400).json({ message: "fileBase64 is required." });
    return;
  }

  const parsed = parseDataUrl(fileBase64);
  if (!parsed) {
    res.status(400).json({
      message: "Invalid report format. Please provide a base64 data URL.",
    });
    return;
  }

  const languageName = languageMap[language || "en"] || "English";
  const mimeType = parsed.mimeType.toLowerCase();

  if (
    !mimeType.includes("pdf") &&
    !mimeType.includes("jpeg") &&
    !mimeType.includes("jpg") &&
    !mimeType.includes("png") &&
    !mimeType.includes("webp")
  ) {
    res.status(400).json({
      message: "Unsupported report type. Use PDF, PNG, JPG, or WEBP.",
    });
    return;
  }

  const systemPrompt = `You are Kairo AI Report Analyzer.
You provide educational healthcare interpretation support and are not a replacement for a licensed clinician.

Rules:
- Be clear, concise, and patient-friendly.
- Do not claim definitive diagnosis.
- Highlight urgent red flags when applicable.
- If document quality is poor, state limitations clearly.
- Do not provide unsafe medication dosing advice.`;

  const userPrompt = `Analyze this uploaded medical report and respond in ${languageName}.
Return a structured markdown response with:
1) **Report Summary**
2) **Important Findings**
3) **What It May Mean (Non-diagnostic)**
4) **Questions to Ask Your Doctor**
5) **Suggested Next Steps**
6) **Urgent Warning Signs (if any)**
7) **Disclaimer**

Complete all sections fully before ending your response.`;

  try {
    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: userPrompt },
            {
              type: "file",
              data: parsed.base64,
              mimeType: parsed.mimeType,
            },
          ],
        },
      ],
      temperature: 0.2,
      maxTokens: 2200,
    });

    res.status(200).json({
      success: true,
      analysis: text.trim(),
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Unable to analyze report right now.",
    });
  }
}

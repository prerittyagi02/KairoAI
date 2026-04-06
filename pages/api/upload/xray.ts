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
  if (!match) {
    return null;
  }
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

  const { imageBase64, language } = req.body as {
    imageBase64?: string;
    language?: string;
  };

  if (!imageBase64 || typeof imageBase64 !== "string") {
    res.status(400).json({ message: "imageBase64 is required." });
    return;
  }

  const parsed = parseDataUrl(imageBase64);
  if (!parsed) {
    res.status(400).json({
      message: "Invalid image format. Please provide a base64 data URL.",
    });
    return;
  }

  const languageName = languageMap[language || "en"] || "English";

  const systemPrompt = `You are Kairo AI Medical Imaging Assistant.
You provide educational interpretation support for X-ray and ECG images.
You are not a substitute for a licensed radiologist/cardiologist.

Rules:
- Never claim a definitive diagnosis.
- Clearly mention uncertainty when image quality is poor.
- Highlight urgent red flags that require immediate in-person care.
- Keep output concise, structured, and patient-friendly.
- Do not provide unsafe medication advice.`;

  const userPrompt = `Analyze this uploaded medical image (X-ray or ECG) and respond in ${languageName}.
Return a concise markdown report with these sections:
1) **Image Type Guess**
2) **Key Visual Findings**
3) **Possible Interpretation (Non-diagnostic)**
4) **Recommended Next Steps**
5) **Urgent Warning Signs**
6) **Disclaimer**

If image quality is insufficient, state what is missing and ask for a clearer upload.
Complete all six sections fully before ending your response.`;

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
              type: "image",
              image: parsed.base64,
              mimeType: parsed.mimeType,
            },
          ],
        },
      ],
      temperature: 0.2,
      maxTokens: 1800,
    });

    res.status(200).json({
      success: true,
      analysis: text.trim(),
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Unable to analyze image right now.",
    });
  }
}

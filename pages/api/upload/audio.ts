import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextApiRequest, NextApiResponse } from "next";

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

type AudioAnalysisResponse = {
  success: true;
  analysis: string;
  transcript: string;
  confidence: number | null;
  urgencyLevel: "low" | "moderate" | "high" | "emergency" | "unknown";
  possibleSymptoms: string[];
  nextSteps: string[];
};

function parseDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!match) return null;
  return { mimeType: match[1], base64: match[2] };
}

function normalizeConfidence(value: unknown): number | null {
  if (typeof value !== "number" || Number.isNaN(value)) return null;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function parseModelJson(raw: string) {
  const fenced = raw.match(/```json\s*([\s\S]*?)\s*```/i)?.[1] ?? raw;
  const payload = JSON.parse(fenced) as {
    transcript?: string;
    analysis_markdown?: string;
    confidence_percent?: number;
    urgency_level?: string;
    possible_symptoms?: string[];
    recommended_next_steps?: string[];
  };

  return {
    transcript: payload.transcript?.trim() || "Transcript unavailable.",
    analysis: payload.analysis_markdown?.trim() || "Analysis unavailable.",
    confidence: normalizeConfidence(payload.confidence_percent),
    urgencyLevel: (payload.urgency_level || "unknown").toLowerCase() as
      | "low"
      | "moderate"
      | "high"
      | "emergency"
      | "unknown",
    possibleSymptoms: Array.isArray(payload.possible_symptoms)
      ? payload.possible_symptoms.filter(Boolean).slice(0, 6)
      : [],
    nextSteps: Array.isArray(payload.recommended_next_steps)
      ? payload.recommended_next_steps.filter(Boolean).slice(0, 6)
      : [],
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AudioAnalysisResponse | { message: string }>
) {
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

  const { audioBase64, language } = req.body as {
    audioBase64?: string;
    language?: string;
  };

  if (!audioBase64 || typeof audioBase64 !== "string") {
    res.status(400).json({ message: "audioBase64 is required." });
    return;
  }

  const parsed = parseDataUrl(audioBase64);
  if (!parsed) {
    res.status(400).json({
      message: "Invalid audio format. Please provide a base64 data URL.",
    });
    return;
  }

  const languageName = languageMap[language || "en"] || "English";
  const prompt = `You are Kairo AI voice symptom assistant.
Analyze this patient voice note and respond in ${languageName}.

Return ONLY valid JSON in this exact schema:
{
  "transcript": "string",
  "analysis_markdown": "string markdown with sections: **Summary**, **Likely Symptom Pattern**, **Urgent Red Flags**, **What To Do Next**, **Disclaimer**",
  "confidence_percent": number (0-100),
  "urgency_level": "low" | "moderate" | "high" | "emergency",
  "possible_symptoms": ["string"],
  "recommended_next_steps": ["string"]
}

Rules:
- Educational guidance only. No definitive diagnosis.
- If audio is unclear, state uncertainty and lower confidence.
- Keep recommendations safe and practical.`;

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  let lastError: unknown;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: parsed.mimeType,
            data: parsed.base64,
          },
        },
      ]);
      const text = result.response.text();
      const parsedOutput = parseModelJson(text);

      res.status(200).json({
        success: true,
        analysis: parsedOutput.analysis,
        transcript: parsedOutput.transcript,
        confidence: parsedOutput.confidence,
        urgencyLevel: parsedOutput.urgencyLevel,
        possibleSymptoms: parsedOutput.possibleSymptoms,
        nextSteps: parsedOutput.nextSteps,
      });
      return;
    } catch (error) {
      lastError = error;
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 900));
      }
    }
  }

  res.status(503).json({
    message:
      lastError instanceof Error
        ? `Failed after 3 attempts. Last error: ${lastError.message}`
        : "Audio analysis is temporarily unavailable. Please try again.",
  });
}

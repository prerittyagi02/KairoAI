import { generateText, streamText } from "ai";
import { google } from "@ai-sdk/google";

type DoctorChatInput = {
  userMessage: string;
  language?: string;
  context?: string;
  conversation?: Array<{ role: "user" | "assistant"; content: string }>;
};

export const DOCTOR_SYSTEM_PROMPT = `You are Kairo AI Doctor Assistant.
You provide educational healthcare support only and are not a replacement for a licensed clinician.

Rules:
- Be clear, calm, practical, and concise.
- Use plain language and avoid jargon.
- Never claim to diagnose with certainty.
- If symptoms are severe (chest pain, breathing difficulty, stroke signs, suicidal thoughts, severe bleeding, high fever in infants, etc.), clearly advise urgent in-person or emergency care.
- When appropriate, provide:
  1) likely possibilities,
  2) what to monitor,
  3) safe next steps,
  4) when to seek urgent care.
- Do not provide unsafe medication dosing instructions.
- If information is missing, ask 2-4 focused follow-up questions.
`;

function normalizeLanguage(language?: string): string {
  if (!language) return "English";
  const map: Record<string, string> = {
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
  return map[language] || language;
}

function buildDoctorPrompt(input: DoctorChatInput): string {
  const languageName = normalizeLanguage(input.language);

  const conversationContext = (input.conversation || [])
    .slice(-8)
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join("\n");

  const promptParts = [
    `Respond in ${languageName}.`,
    input.context ? `Clinical context:\n${input.context}` : "",
    conversationContext ? `Recent conversation:\n${conversationContext}` : "",
    `User message:\n${input.userMessage}`,
  ].filter(Boolean);

  return promptParts.join("\n\n");
}

export async function generateDoctorReply(input: DoctorChatInput): Promise<string> {
  const prompt = buildDoctorPrompt(input);

  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    system: DOCTOR_SYSTEM_PROMPT,
    prompt,
    temperature: 0.4,
    maxTokens: 1200,
  });

  return text.trim();
}

export function streamDoctorReply(input: DoctorChatInput) {
  const prompt = buildDoctorPrompt(input);

  return streamText({
    model: google("gemini-2.5-flash"),
    system: DOCTOR_SYSTEM_PROMPT,
    prompt,
    temperature: 0.4,
    maxTokens: 1200,
  });
}

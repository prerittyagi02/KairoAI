import { apiFetch } from "@/services/api";

export type AnalyzeReportPayload = {
  fileBase64: string;
  language?: string;
};

export type AnalyzeXrayPayload = {
  imageBase64: string;
  language?: string;
};

export type AnalyzeAudioPayload = {
  audioBase64: string;
  language?: string;
};

export type ChatPayload = {
  message: string;
  language?: string;
  context?: string;
};

export async function analyzeReport(payload: AnalyzeReportPayload) {
  return apiFetch<{ analysis: string }>("/api/upload/report", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function analyzeXray(payload: AnalyzeXrayPayload) {
  return apiFetch<{ analysis: string }>("/api/upload/xray", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function analyzeAudio(payload: AnalyzeAudioPayload) {
  return apiFetch<{ analysis: string }>("/api/upload/audio", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function chat(payload: ChatPayload) {
  return apiFetch<{ response: string }>("/api/chat", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

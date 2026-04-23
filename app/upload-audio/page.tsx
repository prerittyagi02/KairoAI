"use client";

import { useMemo, useState } from "react";
import AudioUploader from "@/components/AudioUploader";
import LanguageSelector, { LanguageCode } from "@/components/LanguageSelector";
import Markdown from "@/components/Markdown";
import VoiceRecorder from "@/components/VoiceRecorder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use_toast";
import { analyzeAudio } from "@/services/aiService";

type AudioResult = {
  analysis: string;
  transcript: string;
  confidence: number | null;
  urgencyLevel: "low" | "moderate" | "high" | "emergency" | "unknown";
  possibleSymptoms: string[];
  nextSteps: string[];
} | null;

function urgencyChipClass(urgency: "low" | "moderate" | "high" | "emergency" | "unknown") {
  switch (urgency) {
    case "low":
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-emerald-300";
    case "moderate":
      return "border-amber-200 bg-amber-50 text-amber-700 dark:border-slate-700 dark:bg-slate-900 dark:text-amber-300";
    case "high":
      return "border-orange-200 bg-orange-50 text-orange-700 dark:border-slate-700 dark:bg-slate-900 dark:text-orange-300";
    case "emergency":
      return "border-red-200 bg-red-50 text-red-700 dark:border-slate-700 dark:bg-slate-900 dark:text-red-300";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300";
  }
}

export default function UploadAudioPage() {
  const [file, setFile] = useState<File | null>(null);
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [result, setResult] = useState<AudioResult>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const activeFile =
    file || (recordingBlob ? new File([recordingBlob], "recording.webm") : null);
  const canSubmit = Boolean(activeFile) && !isProcessing;

  const handleAnalyze = async () => {
    if (!activeFile) return;
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      const response = await analyzeAudio({ audioBase64: base64, language });

      if (response.success && response.data) {
        setResult({
          analysis: response.data.analysis,
          transcript: response.data.transcript,
          confidence: response.data.confidence,
          urgencyLevel: response.data.urgencyLevel,
          possibleSymptoms: response.data.possibleSymptoms ?? [],
          nextSteps: response.data.nextSteps ?? [],
        });
      } else {
        setResult(null);
        toast({
          variant: "destructive",
          title: "Analysis failed",
          description: response.error || "Unable to analyze this audio right now.",
        });
      }
      setIsProcessing(false);
    };
    reader.readAsDataURL(activeFile);
  };

  const analysisText = useMemo(() => {
    if (!result?.analysis) {
      return "Record or upload a voice clip and click **Analyze Audio** to get a structured AI symptom summary.";
    }
    return result.analysis;
  }, [result?.analysis]);

  return (
    <div className="rounded-none bg-white/80 px-5 py-3 dark:bg-slate-950/70">
      <h1 className="text-2xl font-semibold text-emerald-700 dark:text-white">Voice Symptom Analyzer</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        Record symptoms or upload an audio file to get transcript, urgency estimate, and actionable next steps.
      </p>

      <div className="mt-3 grid gap-0 lg:grid-cols-2">
        <Card className="rounded-none border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Record or Upload</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <LanguageSelector value={language} onChange={setLanguage} />

            <VoiceRecorder
              onRecordingComplete={(blob) => {
                setRecordingBlob(blob);
                setFile(null);
              }}
              isProcessing={isProcessing}
            />

            <AudioUploader
              onAudioSelected={(f) => {
                setFile(f);
                setRecordingBlob(null);
              }}
              isLoading={isProcessing}
            />

            <Button disabled={!canSubmit} onClick={handleAnalyze} className="w-full">
              {isProcessing ? "Analyzing…" : "Analyze Audio"}
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-none border-slate-200 dark:border-slate-800 lg:border-r-0">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle>AI Clinical Notes</CardTitle>
              <div className="flex flex-wrap gap-2">
                <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-emerald-300">
                  Confidence: {result?.confidence !== null && result?.confidence !== undefined ? `${result.confidence}%` : "N/A"}
                </div>
                <div className={`rounded-full border px-3 py-1 text-xs font-semibold ${urgencyChipClass(result?.urgencyLevel ?? "unknown")}`}>
                  Urgency: {(result?.urgencyLevel ?? "unknown").toUpperCase()}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="min-h-[260px] max-h-[360px] overflow-y-auto rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
              <Markdown text={analysisText} />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Possible Symptoms</p>
                <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-300">
                  {(result?.possibleSymptoms?.length ? result.possibleSymptoms : ["No symptom tags extracted yet."]).map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Recommended Next Steps</p>
                <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-300">
                  {(result?.nextSteps?.length ? result.nextSteps : ["No next-step suggestions yet."]).map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Transcript</p>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                {result?.transcript || "Transcript will appear here after analysis."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

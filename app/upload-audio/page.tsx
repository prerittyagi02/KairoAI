"use client";

import { useMemo, useState } from "react";
import { analyzeAudio } from "@/services/aiService";
import AudioUploader from "@/components/AudioUploader";
import VoiceRecorder from "@/components/VoiceRecorder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UploadAudioPage() {
  const [file, setFile] = useState<File | null>(null);
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
  const [analysis, setAnalysis] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const activeFile = file || (recordingBlob ? new File([recordingBlob], "recording.webm") : null);
  const canSubmit = Boolean(activeFile) && !isProcessing;

  const handleAnalyze = async () => {
    if (!activeFile) return;
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      const result = await analyzeAudio({ audioBase64: base64, language: "en" });
      setAnalysis(result.data?.analysis ?? "No analysis available.");
      setIsProcessing(false);
    };
    reader.readAsDataURL(activeFile);
  };

  const results = useMemo(() => {
    if (!analysis) {
      return "Record or upload a voice clip and click \"Analyze\" to get an AI summary.";
    }
    return analysis;
  }, [analysis]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-10 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Voice Symptom Analyzer</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Record your symptoms or upload an audio file and get a summarized interpretation.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle>Record or Upload</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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

          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle>AI Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-[260px] rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                {results}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

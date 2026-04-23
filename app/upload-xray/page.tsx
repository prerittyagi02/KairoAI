"use client";

import { useMemo, useState } from "react";
import AppFooter from "@/components/AppFooter";
import ImageUploader from "@/components/ImageUploader";
import LanguageSelector, { LanguageCode } from "@/components/LanguageSelector";
import Markdown from "@/components/Markdown";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use_toast";
import { analyzeXray } from "@/services/aiService";

export default function UploadXrayPage() {
	const [file, setFile] = useState<File | null>(null);
	const [analysis, setAnalysis] = useState<string>("");
	const [accuracy, setAccuracy] = useState<number | null>(null);
	const [scanType, setScanType] = useState<"xray" | "ecg">("xray");
	const [ecgLabel, setEcgLabel] = useState<string | null>(null);
	const [ecgConfidence, setEcgConfidence] = useState<number | null>(null);
	const [language, setLanguage] = useState<LanguageCode>("en");
	const [isProcessing, setIsProcessing] = useState(false);

	const canSubmit = Boolean(file) && !isProcessing;

	const handleAnalyze = async () => {
		if (!file) return;
		setIsProcessing(true);
		const reader = new FileReader();
		reader.onloadend = async () => {
			const base64 = reader.result as string;
			const result = await analyzeXray({
				imageBase64: base64,
				language,
				scanType,
			});
			if (result.success) {
				setAnalysis(result.data?.analysis ?? "No analysis available.");
				setAccuracy(
					typeof result.data?.accuracy === "number"
						? result.data.accuracy
						: null,
				);
				setEcgLabel(result.data?.ecgPrediction?.label ?? null);
				setEcgConfidence(
					typeof result.data?.ecgPrediction?.confidence === "number"
						? result.data.ecgPrediction.confidence
						: null,
				);
				if (result.data?.ecgModelError && scanType === "ecg") {
					toast({
						variant: "destructive",
						title: "ECG model unavailable",
						description: "AI analysis is shown, but local ECG model could not run.",
					});
				}
			} else {
				setAnalysis("No analysis available.");
				setAccuracy(null);
				setEcgLabel(null);
				setEcgConfidence(null);
				toast({
					variant: "destructive",
					title: "Analysis failed",
					description:
						result.error || "Unable to analyze this image right now.",
				});
			}
			setIsProcessing(false);
		};
		reader.readAsDataURL(file);
	};

	const results = useMemo(() => {
		if (!analysis) {
			return 'Upload an X-ray or ECG image and click "Analyze" to see insights.';
		}
		return analysis;
	}, [analysis]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-100">
			<Navbar elongate={true} />

			<div className="mx-auto grid w-full grid-cols-1 gap-0 px-3 py-1 lg:grid-cols-[252px_1fr]">
				<Sidebar />
				<main className="min-h-[calc(100vh-140px)]">
					<div className="mt-2 rounded-none bg-white/80 px-5 py-3 dark:bg-slate-950/70 dark:ring-slate-800">
						<h1 className="text-2xl font-semibold text-emerald-700 dark:text-white">
							X-ray & ECG Analyzer
						</h1>
						<p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
							Upload scan images and receive an AI-generated explanation of what
							the image indicates.
						</p>

						<div className="mt-3 grid gap-0 lg:grid-cols-2">
							<Card className=" border-slate-200 dark:border-slate-800 rounded-none">
								<CardHeader>
									<CardTitle>Upload image</CardTitle>
								</CardHeader>
								<CardContent className="space-y-6">
									<LanguageSelector value={language} onChange={setLanguage} />
									<div>
										<p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
											Scan type
										</p>
										<div className="grid grid-cols-2 gap-2">
											<Button
												type="button"
												variant={scanType === "xray" ? "default" : "outline"}
												onClick={() => setScanType("xray")}
												className="w-full"
											>
												X-ray
											</Button>
											<Button
												type="button"
												variant={scanType === "ecg" ? "default" : "outline"}
												onClick={() => setScanType("ecg")}
												className="w-full"
											>
												ECG
											</Button>
										</div>
									</div>
									<ImageUploader
										onImageSelected={setFile}
										isLoading={isProcessing}
									/>
									<Button
										disabled={!canSubmit}
										onClick={handleAnalyze}
										className="w-full"
									>
										{isProcessing ? "Analyzing…" : "Analyze Image"}
									</Button>
								</CardContent>
							</Card>

							<Card className="border-slate-200 dark:border-slate-800 rounded-none lg:border-r-0">
								<CardHeader>
									<div className="flex items-center justify-between gap-3">
										<CardTitle>AI Explanation</CardTitle>
										<div className="flex flex-wrap gap-2">
											<div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-emerald-300">
												Accuracy: {accuracy !== null ? `${accuracy}%` : "N/A"}
											</div>
											{scanType === "ecg" ? (
												<div className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 dark:border-slate-700 dark:bg-slate-900 dark:text-sky-300">
													ECG Model:{" "}
													{ecgLabel && ecgConfidence !== null
														? `${ecgLabel} (${Math.round(ecgConfidence)}%)`
														: "N/A"}
												</div>
											) : null}
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<div className="min-h-[460px] max-h-[680px] overflow-y-auto rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
										<Markdown text={results} />
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</main>
			</div>

			<AppFooter />
		</div>
	);
}

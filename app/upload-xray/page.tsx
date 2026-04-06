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
	const [language, setLanguage] = useState<LanguageCode>("en");
	const [isProcessing, setIsProcessing] = useState(false);

	const canSubmit = Boolean(file) && !isProcessing;

	const handleAnalyze = async () => {
		if (!file) return;
		setIsProcessing(true);
		const reader = new FileReader();
		reader.onloadend = async () => {
			const base64 = reader.result as string;
			const result = await analyzeXray({ imageBase64: base64, language });
			if (result.success) {
				setAnalysis(result.data?.analysis ?? "No analysis available.");
			} else {
				setAnalysis("No analysis available.");
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
			<Navbar />

			<div className="mx-auto grid w-full grid-cols-1 gap-0 px-4 py-0 lg:grid-cols-[256px_1fr]">
				<Sidebar />
				<main className="py-3">
					<div className="rounded-none bg-white/80 px-5 py-3  dark:bg-slate-950/70 dark:ring-slate-800">
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
									<CardTitle>AI Explanation</CardTitle>
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

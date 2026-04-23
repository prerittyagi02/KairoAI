"use client";

import { useMemo, useState } from "react";
import AppFooter from "@/components/AppFooter";
import FileUploader from "@/components/FileUploader";
import LanguageSelector, { LanguageCode } from "@/components/LanguageSelector";
import Markdown from "@/components/Markdown";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use_toast";
import { analyzeReport } from "@/services/aiService";

export default function UploadReportPage() {
	const [file, setFile] = useState<File | null>(null);
	const [analysis, setAnalysis] = useState<string>("");
	const [language, setLanguage] = useState<LanguageCode>("en");
	const [isProcessing, setIsProcessing] = useState(false);

	const canSubmit = Boolean(file) && !isProcessing;

	const handleUpload = async () => {
		if (!file) return;
		setIsProcessing(true);

		const reader = new FileReader();
		reader.onloadend = async () => {
			const base64 = reader.result as string;
			const result = await analyzeReport({ fileBase64: base64, language });

			if (result.success) {
				setAnalysis(result.data?.analysis ?? "No analysis available.");
			} else {
				setAnalysis("No analysis available.");
				toast({
					variant: "destructive",
					title: "Analysis failed",
					description: result.error || "Unable to analyze report right now.",
				});
			}

			setIsProcessing(false);
		};
		reader.readAsDataURL(file);
	};

	const results = useMemo(() => {
		if (!analysis) {
			return 'Upload a report and click "Analyze" to see AI insights.';
		}
		return analysis;
	}, [analysis]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-100">
			<Navbar elongate={true} />

			<div className="mx-auto grid w-full grid-cols-1 gap-0 px-3 py-1 lg:grid-cols-[252px_1fr]">
				<Sidebar />
				<main className="min-h-[calc(100vh-140px)]">
					<div className="mt-2 rounded-none bg-white/80 px-5 py-3 shadow-sm ring-1 ring-slate-200 backdrop-blur dark:bg-slate-950/70 dark:ring-slate-800">
						<h1 className="text-2xl font-semibold text-emerald-700 dark:text-white">
							Report Analyzer
						</h1>
						<p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
							Upload a medical report and get easy-to-understand insights and
							recommendations.
						</p>

						<div className="mt-3 grid gap-0 lg:grid-cols-2">
							<Card className="border-slate-200 rounded-none dark:border-slate-800 lg:border-r-0">
								<CardHeader>
									<CardTitle>Upload & Analyze</CardTitle>
								</CardHeader>
								<CardContent className="space-y-6">
									<LanguageSelector value={language} onChange={setLanguage} />
									<FileUploader
										accept="application/pdf,image/png,image/jpeg,image/webp"
										onFileSelected={setFile}
										isLoading={isProcessing}
									/>
									<Button
										disabled={!canSubmit}
										onClick={handleUpload}
										className="w-full"
									>
										{isProcessing ? "Analyzing…" : "Analyze Report"}
									</Button>
								</CardContent>
							</Card>

							<Card className="border-slate-200 rounded-none dark:border-slate-800">
								<CardHeader>
									<CardTitle>AI Analysis</CardTitle>
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

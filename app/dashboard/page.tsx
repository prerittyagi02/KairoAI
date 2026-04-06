import Link from "next/link";
import {
	ArrowRight,
	BarChart,
	FileText,
	HeartPulse,
	ImageIcon,
	MessageCircle,
	Mic,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
	return (
		<div className="space-y-5">
			<section className="overflow-hidden rounded-lg border border-emerald-300 bg-emerald-100 p-6  dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
				<p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-700 dark:text-emerald-300">
					Health Command Center
				</p>
				<h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
					Welcome to your care dashboard
				</h1>
				<p className="mt-2 max-w-2xl text-sm text-slate-700 dark:text-slate-300">
					Upload reports, analyze scans, and get AI explanations in one workflow built for clarity.
				</p>
				<div className="mt-5 flex flex-wrap gap-2">
					<Badge className="rounded-full bg-white/90 text-slate-900 dark:bg-slate-800 dark:text-slate-100">Report Analyzer</Badge>
					<Badge className="rounded-full bg-white/90 text-slate-900 dark:bg-slate-800 dark:text-slate-100">X-ray Insight</Badge>
					<Badge className="rounded-full bg-white/90 text-slate-900 dark:bg-slate-800 dark:text-slate-100">Voice Symptom</Badge>
					<Badge className="rounded-full bg-white/90 text-slate-900 dark:bg-slate-800 dark:text-slate-100">AI Doctor Chat</Badge>
				</div>
			</section>

			<section className="grid gap-3 md:grid-cols-3">
				<Link href="/upload-report" className="group rounded-lg border border-emerald-300 bg-gradient-to-b from-white to-emerald-50/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-md dark:border-slate-700 dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-900">
					<div className="flex items-center justify-between">
						<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-slate-800 dark:text-emerald-300">
							<FileText className="h-5 w-5" />
						</div>
						<ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1" />
					</div>
					<p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">Upload Report</p>
					<p className="mt-1 text-xs text-slate-600 dark:text-slate-400">Get a plain-language medical summary.</p>
				</Link>

				<Link href="/upload-xray" className="group rounded-lg border border-sky-300 bg-gradient-to-b from-white to-sky-50/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-500 hover:shadow-md dark:border-slate-700 dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-900">
					<div className="flex items-center justify-between">
						<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700 dark:bg-slate-800 dark:text-sky-300">
							<ImageIcon className="h-5 w-5" />
						</div>
						<ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1" />
					</div>
					<p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">Analyze X-ray / ECG</p>
					<p className="mt-1 text-xs text-slate-600 dark:text-slate-400">Image-based findings with AI explanation.</p>
				</Link>

				<Link href="/chat" className="group rounded-lg border border-fuchsia-300 bg-gradient-to-b from-white to-fuchsia-50/70 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-fuchsia-500 hover:shadow-md dark:border-slate-700 dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-900">
					<div className="flex items-center justify-between">
						<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-100 text-fuchsia-700 dark:bg-slate-800 dark:text-fuchsia-300">
							<MessageCircle className="h-5 w-5" />
						</div>
						<ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1" />
					</div>
					<p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">Doctor Chat</p>
					<p className="mt-1 text-xs text-slate-600 dark:text-slate-400">Ask follow-up questions and next steps.</p>
				</Link>
			</section>

			<div className="grid gap-3 md:grid-cols-2">
				<Card className="rounded-lg border-emerald-300 bg-gradient-to-b from-white to-emerald-50/70 shadow-sm dark:border-slate-700 dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-900">
					<CardHeader className="pb-2">
						<CardTitle className="flex items-center gap-2 text-base">
							<FileText className="h-5 w-5 text-teal-600" />
							Recent Uploads
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
						<p>No reports uploaded yet. Start by uploading a report, image, or voice note.</p>
						<div className="flex flex-wrap gap-2 pt-2">
							<Badge className="rounded-full bg-emerald-500">0 Reports</Badge>
							<Badge className="rounded-full bg-emerald-500">0 Scans</Badge>
							<Badge className="rounded-full bg-emerald-500">0 Voice Notes</Badge>
						</div>
					</CardContent>
				</Card>

				<Card className="rounded-lg border-indigo-300 bg-gradient-to-b from-white to-indigo-50/60 shadow-sm dark:border-slate-700 dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-900">
					<CardHeader className="pb-2">
						<CardTitle className="flex items-center gap-2 text-base">
							<BarChart className="h-5 w-5 text-indigo-600" />
							Health Insights
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
						<p>Kairo AI will surface risk flags and trend summaries after your first uploads.</p>
						<p>Use Report Analyzer and X-ray module to unlock personalized insights here.</p>
					</CardContent>
				</Card>
			</div>

			<section className="grid gap-3 md:grid-cols-3">
				<Card className="rounded-lg border-fuchsia-300 bg-gradient-to-b from-white to-fuchsia-50/60 shadow-sm dark:border-slate-700 dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-900">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<MessageCircle className="h-5 w-5 text-fuchsia-600" />
							AI Chat
						</CardTitle>
					</CardHeader>
					<CardContent className="text-sm text-slate-600 dark:text-slate-400">
						Ask questions about your health, get suggestions, and clarify
						medical terminology.
					</CardContent>
				</Card>

				<Card className="rounded-lg border-rose-300 bg-gradient-to-b from-white to-rose-50/60 shadow-sm dark:border-slate-700 dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-900">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<HeartPulse className="h-5 w-5 text-red-600" />
							Wellness reminders
						</CardTitle>
					</CardHeader>
					<CardContent className="text-sm text-slate-600 dark:text-slate-400">
						Track medication timing, symptom trends, and follow-up actions with upcoming reminders.
					</CardContent>
				</Card>

				<Card className="rounded-lg border-emerald-300 bg-gradient-to-b from-white to-emerald-50/60 shadow-sm dark:border-slate-700 dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-900">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Mic className="h-5 w-5 text-emerald-600" />
							Voice Symptom
						</CardTitle>
					</CardHeader>
					<CardContent className="text-sm text-slate-600 dark:text-slate-400">
						Describe symptoms naturally by voice and receive structured summaries in your language.
					</CardContent>
				</Card>
			</section>
		</div>
	);
}

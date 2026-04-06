import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type AppFooterProps = {
	className?: string;
};

export default function AppFooter({ className }: AppFooterProps) {
	return (
		<footer
			className={cn(
				"w-full pt-4 border-t border-emerald-100 bg-white/80 py-3 dark:border-slate-800 dark:bg-slate-950/95",
				className,
			)}
		>
			<div className="w-full px-4 pt-2 sm:px-6">
				<div className="grid gap-4 md:grid-cols-5 md:items-start">
					<div>
						<div className="flex items-center gap-2.5">
							<Image
								src="/k.webp"
								alt="Kairo AI Logo"
								width={34}
								height={34}
								className="h-8 w-8 rounded-lg object-cover shadow-sm"
							/>
							<p className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">
								Kairo AI
							</p>
						</div>
						<p className="mt-1.5 max-w-sm text-xs text-slate-600 dark:text-slate-400">
							AI-powered healthcare assistance for clear reports, symptom
							tracking, and confident next steps.
						</p>
					</div>

					<div>
						<p className="text-xs font-semibold uppercase tracking-wide text-slate-900 dark:text-white">
							Quick links
						</p>
						<div className="mt-2 flex flex-col gap-1 text-xs text-slate-600 dark:text-slate-400">
							<Link
								href="/about"
								className="hover:text-emerald-700 dark:hover:text-emerald-300"
							>
								About
							</Link>
							<Link
								href="/dashboard"
								className="hover:text-emerald-700 dark:hover:text-emerald-300"
							>
								Dashboard
							</Link>
							<Link
								href="/chat"
								className="hover:text-emerald-700 dark:hover:text-emerald-300"
							>
								AI Chat
							</Link>
						</div>
					</div>

					<div>
						<p className="text-xs font-semibold uppercase tracking-wide text-slate-900 dark:text-white">
							Account
						</p>
						<div className="mt-2 flex flex-col gap-1 text-xs text-slate-600 dark:text-slate-400">
							<Link
								href="/signup"
								className="hover:text-emerald-700 dark:hover:text-emerald-300"
							>
								Create account
							</Link>
							<Link
								href="/login"
								className="hover:text-emerald-700 dark:hover:text-emerald-300"
							>
								Login
							</Link>
						</div>
					</div>

					<div>
						<p className="text-xs font-semibold uppercase tracking-wide text-slate-900 dark:text-white">
							Tools
						</p>
						<div className="mt-2 flex flex-col gap-1 text-xs text-slate-600 dark:text-slate-400">
							<Link
								href="/upload-report"
								className="hover:text-emerald-700 dark:hover:text-emerald-300"
							>
								Report Analyzer
							</Link>
							<Link
								href="/upload-xray"
								className="hover:text-emerald-700 dark:hover:text-emerald-300"
							>
								X-ray & ECG
							</Link>
							<Link
								href="/upload-audio"
								className="hover:text-emerald-700 dark:hover:text-emerald-300"
							>
								Voice Symptoms
							</Link>
						</div>
					</div>

					<div>
						<p className="text-xs font-semibold uppercase tracking-wide text-slate-900 dark:text-white">
							Highlights
						</p>
						<div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
							<span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
								Multilingual
							</span>
							<span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
								AI Insights
							</span>
							<span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
								Privacy-first
							</span>
						</div>
					</div>
				</div>

				<div className="mt-3 flex flex-col gap-1 border-t border-emerald-100 pt-2.5 text-[11px] text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
					<p>© {new Date().getFullYear()} Kairo AI. All rights reserved.</p>
					<p>Privacy-first. Built for clear and accessible care guidance.</p>
				</div>
			</div>
		</footer>
	);
}

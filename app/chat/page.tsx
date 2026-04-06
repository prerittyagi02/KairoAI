"use client";

import Image from "next/image";
import { useCallback } from "react";
import AppFooter from "@/components/AppFooter";
import ChatBox from "@/components/ChatBox";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { chat } from "@/services/aiService";

export default function ChatPage() {
	const handleSend = useCallback(
		async (message: string, languageCode: string) => {
			const response = await chat({ message, language: languageCode });
			return response.data?.response ?? "";
		},
		[],
	);

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-100">
			<Navbar elongate={true} />

			<div className="mx-auto grid w-full grid-cols-1 gap-0 px-3 py-1 lg:grid-cols-[252px_1fr]">
				<Sidebar />
				<main className="min-h-[calc(100vh-140px)]">
					<div className="grid gap-2 xl:grid-cols-[1fr_292px]">
						<div className="mt-2 overflow-hidden rounded-none lg:[&>div]:rounded-l-none lg:[&>div]:rounded-r-none lg:[&>div]:border-l-0">
							<ChatBox initialLanguage="en" onSend={handleSend} />
						</div>

						<aside className="mt-2 space-y-3">
							<div className="overflow-hidden rounded-none border border-emerald-200 bg-white dark:border-slate-700 dark:bg-slate-900">
								<Image
									src="/doctor.jpg"
									alt="Doctor support"
									width={500}
									height={340}
									className="h-44 w-full object-cover"
								/>
								<div className="p-4">
									<p className="text-sm font-semibold text-slate-900 dark:text-white">
										Ask better health questions
									</p>
									<p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
										Mention duration, severity, and related symptoms for more
										useful AI guidance.
									</p>
								</div>
							</div>

							<div className="rounded-none border border-emerald-200 bg-emerald-50/70 p-4 dark:border-slate-700 dark:bg-slate-900">
								<p className="text-sm font-semibold text-slate-900 dark:text-white">
									Helpful prompts
								</p>
								<div className="mt-3 space-y-2 text-xs text-slate-700 dark:text-slate-300">
									<p className="rounded-lg bg-white/80 px-3 py-2 dark:bg-slate-800">
										What could these lab values indicate?
									</p>
									<p className="rounded-lg bg-white/80 px-3 py-2 dark:bg-slate-800">
										What should I monitor over the next 48 hours?
									</p>
									<p className="rounded-lg bg-white/80 px-3 py-2 dark:bg-slate-800">
										When should I seek urgent medical care?
									</p>
								</div>
							</div>
						</aside>
					</div>
				</main>
			</div>

			<AppFooter className="mt-2" />
		</div>
	);
}

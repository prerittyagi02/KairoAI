"use client";

import { Brain, HeartHandshake, Languages, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AppFooter from "@/components/AppFooter";
import Navbar from "@/components/Navbar";
import { useAuthUser } from "@/hooks/useAuthUser";

const values = [
	{
		title: "Accessibility",
		description:
			"We turn complex medical language into clear, practical explanations for everyday users.",
		icon: Languages,
	},
	{
		title: "Accuracy",
		description:
			"Clinical context and careful model behavior are prioritized in every report and response.",
		icon: Brain,
	},
	{
		title: "Empathy",
		description:
			"Health conversations are sensitive. We design guidance that stays supportive and calm.",
		icon: HeartHandshake,
	},
	{
		title: "Privacy",
		description:
			"Data safety, secure flows, and confidentiality are treated as baseline requirements.",
		icon: ShieldCheck,
	},
];

export default function AboutPage() {
	const { isAuthenticated, isLoading } = useAuthUser();

	return (
		<div className="min-h-screen bg-gradient-to-b from-emerald-50/70 via-white to-sky-50/70 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
			<Navbar />

			<main className="mx-auto max-w-7xl px-4 py-5 sm:py-4">
				<section className="rounded-3xl border border-emerald-200 bg-white/85 p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900/80 sm:p-12">
					<p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
						About Kairo AI
					</p>
					<h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
						Built to make health understanding simple, clear, and reliable
					</h1>
					<p className="mt-5 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
						Kairo AI helps patients and families understand reports, symptoms,
						and next steps without getting lost in clinical jargon. We combine
						medical context, multilingual support, and practical guidance so
						users can prepare better for real healthcare conversations.
					</p>

					<div className="mt-8 grid gap-4 sm:grid-cols-3">
						<div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 dark:border-slate-700 dark:bg-slate-900">
							<p className="text-2xl font-semibold text-slate-900 dark:text-white">
								4+
							</p>
							<p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
								Core health workflows
							</p>
						</div>
						<div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 dark:border-slate-700 dark:bg-slate-900">
							<p className="text-2xl font-semibold text-slate-900 dark:text-white">
								10+
							</p>
							<p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
								Supported languages
							</p>
						</div>
						<div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 dark:border-slate-700 dark:bg-slate-900">
							<p className="text-2xl font-semibold text-slate-900 dark:text-white">
								24/7
							</p>
							<p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
								AI guidance availability
							</p>
						</div>
					</div>
				</section>

				<section className="mt-4 grid gap-6 md:grid-cols-2">
					<div className="rounded-3xl border border-emerald-200 bg-white/85 p-8 dark:border-slate-700 dark:bg-slate-900/80">
						<Image
							src="https://images.pexels.com/photos/5452251/pexels-photo-5452251.jpeg?cs=srgb&dl=pexels-tima-miroshnichenko-5452251.jpg&fm=jpg"
							alt="Doctor discussing care plan with patient"
							width={1200}
							height={700}
							className="mb-5 h-44 w-full rounded-2xl object-cover"
						/>
						<h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
							Our Mission
						</h2>
						<p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
							We aim to bridge the gap between medical data and everyday
							understanding so people can make more confident decisions. From
							blood reports to symptom follow-ups, Kairo AI is focused on
							clarity, usability, and practical care communication.
						</p>
					</div>

					<div className="rounded-3xl border border-emerald-200 bg-white/85 p-8 dark:border-slate-700 dark:bg-slate-900/80">
						<Image
							src="https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg?cs=srgb&dl=pexels-anna-shvets-7089401.jpg&fm=jpg"
							alt="Healthcare professional using digital tablet"
							width={1200}
							height={700}
							className="mb-5 h-44 w-full rounded-2xl object-cover"
						/>
						<h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
							How We Build
						</h2>
						<p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
							Our product combines AI engineering, healthcare-aware design, and
							continuous iteration from user feedback. Every feature is
							evaluated for readability, trust, and actionability before
							release.
						</p>
					</div>
				</section>

				<section className="mt-10 rounded-3xl border border-emerald-200 bg-white/85 p-8 dark:border-slate-700 dark:bg-slate-900/80 sm:p-10">
					<Image
						src="https://images.pexels.com/photos/7108345/pexels-photo-7108345.jpeg?cs=srgb&dl=pexels-anna-shvets-7108345.jpg&fm=jpg"
						alt="Patient and clinician reviewing health information"
						width={1600}
						height={900}
						className="mb-6 h-52 w-full rounded-2xl object-cover"
					/>
					<h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
						Our Values
					</h2>
					<div className="mt-3 grid gap-4 md:grid-cols-2">
						{values.map((item) => {
							const Icon = item.icon;
							return (
								<div
									key={item.title}
									className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 dark:border-slate-700 dark:bg-slate-900"
								>
									<div className="flex items-center gap-3">
										<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-slate-800 dark:text-emerald-300">
											<Icon className="h-4 w-4" />
										</div>
										<p className="text-base font-semibold text-slate-900 dark:text-white">
											{item.title}
										</p>
									</div>
									<p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
										{item.description}
									</p>
								</div>
							);
						})}
					</div>
				</section>

				<section className="mt-10 overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-100/80 to-sky-100/80 p-8 dark:border-slate-700 dark:from-slate-900 dark:to-slate-800 sm:p-10">
					<div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
						<div>
							<h3 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
								Build better health conversations with Kairo AI
							</h3>
							<p className="mt-3 max-w-2xl text-sm text-slate-700 dark:text-slate-300">
								Start with report analysis, symptom capture, and AI doctor chat
								in one connected workspace.
							</p>
						</div>
						<div className="flex w-full gap-3 sm:w-auto">
							{!isLoading && !isAuthenticated ? (
								<Link href="/signup" className="flex-1 sm:flex-none">
									<button
										className="w-full rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
										type="button"
									>
										Create account
									</button>
								</Link>
							) : null}
							<Link href="/dashboard" className="flex-1 sm:flex-none">
								<button
									className="w-full rounded-full border border-emerald-300 bg-white/90 px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-emerald-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
									type="button"
								>
									Open dashboard
								</button>
							</Link>
						</div>
					</div>
				</section>
			</main>

			<AppFooter />
		</div>
	);
}

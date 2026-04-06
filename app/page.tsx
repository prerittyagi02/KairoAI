"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import FeaturesSection from "@/components/FeaturesSection";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import AppFooter from "@/components/AppFooter";
import { useAuthUser } from "@/hooks/useAuthUser";

const testimonials = [
	{
		quote:
			"Kairo helped me finally understand my blood report before my doctor visit. I asked better questions and felt prepared.",
		author: "Priya S.",
		role: "Patient",
	},
	{
		quote:
			"The voice symptom feature is very practical for family members who are not comfortable typing long details.",
		author: "Rohan M.",
		role: "Caregiver",
	},
	{
		quote:
			"Clear summaries and multilingual support make this genuinely useful for day-to-day health communication.",
		author: "Anita K.",
		role: "Community Health Worker",
	},
];

export default function HomePage() {
	const [showStickyCta, setShowStickyCta] = useState(false);
	const [dismissStickyCta, setDismissStickyCta] = useState(false);
	const { isAuthenticated } = useAuthUser();

	useEffect(() => {
		const onScroll = () => {
			if (isAuthenticated) {
				return setShowStickyCta(false);
			}
			setShowStickyCta(window.scrollY > 420);
		};

		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, [isAuthenticated]);

	return (
		<div className="min-h-screen bg-gradient-to-b from-emerald-50/70 via-white to-sky-50/70 dark:bg-gradient-to-b dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
			<Navbar />
			<main>
				<HeroSection />
				<FeaturesSection />

				<section className="py-16 sm:py-12">
					<div className="mx-auto max-w-7xl px-4">
						<div className="rounded-3xl border border-emerald-200 bg-white/80 p-7 dark:border-slate-700 dark:bg-slate-900/80 sm:p-10">
							<div className="text-center">
								<p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-300">
									Trusted Experience
								</p>
								<h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
									Built for real healthcare conversations
								</h2>
								<p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
									Kairo AI is designed to make clinical information easier to
									understand for patients, families, and care teams.
								</p>
							</div>

							<div className="mt-6 flex flex-wrap justify-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
								<span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 dark:border-slate-600 dark:bg-slate-800">
									CityCare Clinics
								</span>
								<span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 dark:border-slate-600 dark:bg-slate-800">
									MedLink Labs
								</span>
								<span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 dark:border-slate-600 dark:bg-slate-800">
									Community Health Network
								</span>
								<span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 dark:border-slate-600 dark:bg-slate-800">
									TeleCare Partners
								</span>
							</div>

							<div className="mt-8 grid gap-4 md:grid-cols-3">
								{testimonials.map((item) => (
									<div
										key={item.author}
										className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 dark:border-slate-700 dark:bg-slate-900/90"
									>
										<p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
											&ldquo;{item.quote}&rdquo;
										</p>
										<p className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
											{item.author}
										</p>
										<p className="text-xs text-slate-500 dark:text-slate-400">
											{item.role}
										</p>
									</div>
								))}
							</div>
						</div>
					</div>
				</section>

				<section className="bg-transparent py-16 sm:py-5">
					<div className="mx-auto max-w-7xl px-4">
						<div className="text-center">
							<h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
								How it works
							</h2>
							<p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
								Upload a report, speak your symptoms, and get AI-generated
								explanations with a multilingual assistant that adapts to your
								needs.
							</p>
						</div>

						<div className="mt-12 grid gap-8 md:grid-cols-3">
							<div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-7 dark:border-slate-700 dark:bg-slate-900/90">
								<Image
									src="https://images.pexels.com/photos/6627839/pexels-photo-6627839.jpeg?cs=srgb&dl=pexels-karolina-grabowska-6627839.jpg&fm=jpg"
									alt="Doctor reviewing medical documents"
									width={900}
									height={500}
									className="mb-5 h-40 w-full rounded-xl object-cover"
								/>
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-800 dark:bg-slate-800 dark:text-emerald-300">
									1
								</div>
								<h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
									Upload medical data
								</h3>
								<p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
									Add reports, scans or voice notes so our AI can understand
									your health context.
								</p>
							</div>

							<div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-7 dark:border-slate-700 dark:bg-slate-900/90">
								<Image
									src="https://images.pexels.com/photos/5452291/pexels-photo-5452291.jpeg?cs=srgb&dl=pexels-tima-miroshnichenko-5452291.jpg&fm=jpg"
									alt="Doctor using tablet for analysis"
									width={900}
									height={500}
									className="mb-5 h-40 w-full rounded-xl object-cover"
								/>
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-800 dark:bg-slate-800 dark:text-emerald-300">
									2
								</div>
								<h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
									AI analyzes it
								</h3>
								<p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
									The assistant reads your files or voice input to identify
									insights and explain terminology.
								</p>
							</div>

							<div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-7 dark:border-slate-700 dark:bg-slate-900/90">
								<Image
									src="https://images.pexels.com/photos/4266934/pexels-photo-4266934.jpeg?cs=srgb&dl=pexels-cedric-fauntleroy-4266934.jpg&fm=jpg"
									alt="Doctor sharing treatment insights with patient"
									width={900}
									height={500}
									className="mb-5 h-40 w-full rounded-xl object-cover"
								/>
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-800 dark:bg-slate-800 dark:text-emerald-300">
									3
								</div>
								<h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
									Get actionable insights
								</h3>
								<p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
									Receive easy-to-understand explanations, follow-up questions,
									and next step recommendations.
								</p>
							</div>
						</div>

						<div className="mt-16 overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-100/80 to-sky-100/80 px-6 py-10 dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 sm:px-10">
							<div className="mx-auto max-w-4xl text-center">
								<p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
									Start today
								</p>
								<h3 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
									Feel more confident about every health decision
								</h3>
								<p className="mx-auto mt-4 max-w-2xl text-sm text-slate-700 dark:text-slate-300">
									From report understanding to symptom follow-ups, Kairo AI
									gives you clear guidance in minutes.
								</p>

								<div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
									<span className="rounded-full border border-emerald-200 bg-white/80 px-3 py-1 dark:border-slate-600 dark:bg-slate-800/80">
										Fast setup
									</span>
									<span className="rounded-full border border-emerald-200 bg-white/80 px-3 py-1 dark:border-slate-600 dark:bg-slate-800/80">
										Multilingual support
									</span>
									<span className="rounded-full border border-emerald-200 bg-white/80 px-3 py-1 dark:border-slate-600 dark:bg-slate-800/80">
										Privacy-first workflow
									</span>
								</div>

								<div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
									<Link href="/signup">
										<button className="rounded-full bg-emerald-700 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 dark:bg-emerald-600 dark:text-white dark:hover:bg-emerald-500">
											Create free account
										</button>
									</Link>
									<Link href="/login">
										<button className="rounded-full border border-emerald-300 bg-white/90 px-8 py-3 text-sm font-semibold text-slate-900 hover:bg-emerald-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">
											Login
										</button>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>

			<AppFooter />

			{showStickyCta && !dismissStickyCta ? (
				<div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 rounded-2xl border border-emerald-300 bg-white/95 p-3 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
					<div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
						<p className="text-sm font-medium text-slate-800 dark:text-slate-200">
							Start with Kairo AI in under 2 minutes.
						</p>
						<div className="flex w-full items-center gap-2 sm:w-auto">
							<Link href="/signup" className="flex-1 sm:flex-none">
								<button className="w-full rounded-full bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800">
									Create free account
								</button>
							</Link>
							<Link href="/login" className="flex-1 sm:flex-none">
								<button className="w-full rounded-full border border-emerald-300 bg-white px-4 py-2 text-xs font-semibold text-slate-900 hover:bg-emerald-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">
									Login
								</button>
							</Link>
							<button
								onClick={() => setDismissStickyCta(true)}
								aria-label="Dismiss sticky call to action"
								className="rounded-full border border-emerald-200 px-2 py-1 text-xs text-slate-500 hover:bg-emerald-50 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-800"
							>
								✕
							</button>
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
}

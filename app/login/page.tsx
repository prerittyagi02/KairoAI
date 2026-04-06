"use client";

import { useSetAtom } from "jotai";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use_toast";
import { login } from "@/services/authService";
import { hydrateAuthUserAtom } from "@/store/authAtom";

export default function LoginPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const hydrateAuthUser = useSetAtom(hydrateAuthUserAtom);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [formError, setFormError] = useState("");

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setFormError("");
		const safeEmail = email.trim().toLowerCase();
		const safePassword = password.trim();
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!safeEmail) {
			toast({
				variant: "destructive",
				title: "Email is required",
				description: "Please enter your email address.",
			});
			setFormError("Please enter your email address.");
			return;
		}

		if (!emailRegex.test(safeEmail)) {
			toast({
				variant: "destructive",
				title: "Invalid email",
				description: "Please enter a valid email address.",
			});
			setFormError("Please enter a valid email address.");
			return;
		}

		if (!safePassword) {
			toast({
				variant: "destructive",
				title: "Password is required",
				description: "Please enter your password.",
			});
			setFormError("Please enter your password.");
			return;
		}

		setIsLoading(true);

		const result = await login({ email: safeEmail, password: safePassword });

		if (result.success && result.data?.token) {
			localStorage.setItem("kairo_token", result.data.token);
			await hydrateAuthUser(true);
			toast({ title: "Welcome back!", description: "You are now logged in." });
			const next = searchParams?.get("next") || "/dashboard";
			router.push(next);
			router.refresh();
		} else {
			const message =
				result.error || "Unable to authenticate with provided credentials.";
			toast({
				variant: "destructive",
				title: "Login failed",
				description: message,
			});
			setFormError(message);
		}

		setIsLoading(false);
	};

	return (
		<div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-sky-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
			<div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-emerald-200/50 blur-3xl dark:hidden" />
			<div className="pointer-events-none absolute -right-16 bottom-20 h-72 w-72 rounded-full bg-sky-200/50 blur-3xl dark:hidden" />
			<Link
				href="/"
				className="absolute left-6 top-6 z-20 inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-white/95 px-3 py-2 text-sm font-medium text-emerald-800 shadow-sm hover:bg-emerald-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
			>
				<ArrowLeft className="h-4 w-4" />
				Back
			</Link>

			<div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-12">
				<div className="mx-auto w-full max-w-md rounded-3xl border border-emerald-300 bg-white p-10 shadow-[0_22px_70px_-28px_rgba(5,150,105,0.45)] backdrop-blur dark:border-slate-600 dark:bg-slate-900">
					<h1 className="text-2xl font-bold text-slate-900 dark:text-white">
						Welcome back
					</h1>
					<p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
						Log in to access your personal health dashboard and AI assistant.
					</p>

					<form onSubmit={handleSubmit} className="mt-8 space-y-6">
						<div className="space-y-4">
							<div>
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="you@example.com"
									required
									className="mt-1 border-emerald-200 bg-emerald-50/40 focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800"
								/>
							</div>

							<div>
								<Label htmlFor="password">Password</Label>
								<Input
									id="password"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="••••••••"
									required
									className="mt-1 border-emerald-200 bg-emerald-50/40 focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800"
								/>
							</div>
						</div>

						<Button
							type="submit"
							className="w-full bg-emerald-700 text-white hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
							disabled={isLoading}
						>
							{isLoading ? "Signing in..." : "Login"}
						</Button>
						{formError ? (
							<p className="text-center text-sm font-medium text-red-600 dark:text-red-400">
								{formError}
							</p>
						) : null}
					</form>

					<div className="mt-6 border-t border-emerald-100 pt-6 text-center text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400">
						Don’t have an account?{" "}
						<Link
							href="/signup"
							className="font-medium text-emerald-700 hover:text-emerald-800 dark:text-emerald-300"
						>
							Sign up
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

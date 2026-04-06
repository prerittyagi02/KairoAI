"use client";

import { motion } from "framer-motion";
import { Menu, Moon, Sun, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSetAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { useAuthUser } from "@/hooks/useAuthUser";
import { cn } from "@/lib/utils";
import { logout } from "@/services/authService";
import { setAuthUserAtom } from "@/store/authAtom";

const publicNavItems = [
	{ href: "/", label: "Home" },
	{ href: "/about", label: "About" },
];

const protectedNavItems = [
	{ href: "/dashboard", label: "Dashboard" },
	{ href: "/chat", label: "AI Chat" },
];

export default function Navbar({ elongate }: { elongate?: boolean }) {
	const pathname = usePathname();
	const router = useRouter();
	const setAuthUser = useSetAtom(setAuthUserAtom);
	const [open, setOpen] = useState(false);
	const [isDark, setIsDark] = useState(false);
	const { user, isLoading, isAuthenticated } = useAuthUser();
	const navItems = isAuthenticated
		? [...publicNavItems, ...protectedNavItems]
		: publicNavItems;

	useEffect(() => {
		const stored = localStorage.getItem("darkMode");
		const dark =
			stored === "true" ||
			(!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
		setIsDark(dark);
		document.documentElement.classList.toggle("dark", dark);
	}, []);

	const toggleDark = () => {
		const newDark = !isDark;
		setIsDark(newDark);
		localStorage.setItem("darkMode", newDark.toString());
		document.documentElement.classList.toggle("dark", newDark);
	};

	const handleLogout = async () => {
		await logout();
		setAuthUser(null);
		localStorage.removeItem("kairo_token");
		router.push("/");
		router.refresh();
	};

	return (
		<header className="sticky top-0 z-50 border-b border-slate-200/70 bg-emerald-700 text-white backdrop-blur-md dark:bg-slate-950/70 dark:border-slate-800">
			<div
				className={`mx-auto flex h-16 ${elongate ? "w-full" : "max-w-7xl"} items-center justify-between px-4 sm:px-6`}
			>
				<Link href="/" className="flex items-center gap-3">
					<img
						src="/k.webp"
						alt="Kairo AI Logo"
						className="h-10 w-10 rounded-xl shadow"
					/>
					<div className="hidden flex-col leading-tight sm:flex">
						<span className="text-sm font-semibold tracking-tight">
							Kairo AI
						</span>
						<span className="text-xs text-white dark:text-slate-400">
							Multilingual Healthcare Assistant
						</span>
					</div>
				</Link>

				<nav className="hidden items-center gap-2 md:flex">
					{navItems.map((item) => {
						const active = pathname === item.href;
						return (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									"rounded-lg px-5 py-2 text-sm font-medium transition-colors",
									active
										? "bg-blue-50 text-emerald-700 dark:bg-emerald-600/20 dark:text-blue-200"
										: "text-white hover:scale-105 hover:text-white dark:text-slate-200 dark:hover:text-blue-200",
								)}
							>
								{item.label}
							</Link>
						);
					})}
				</nav>

				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="sm"
						onClick={toggleDark}
						className="rounded-full p-2"
					>
						{isDark ? (
							<Sun className="h-4 w-4" />
						) : (
							<Moon className="h-4 w-4" />
						)}
					</Button>
					{!isLoading && !isAuthenticated ? (
						<>
							<Link href="/login">
								<Button
									variant="outline"
									size="sm"
									className="hidden border-white/70 bg-transparent text-white hover:bg-white hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 md:inline-flex"
								>
									Login
								</Button>
							</Link>
							<Link href="/signup">
								<Button
									size="sm"
									className="hidden bg-white text-emerald-700 hover:bg-emerald-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 md:inline-flex"
								>
									Sign up
								</Button>
							</Link>
						</>
					) : null}
					{!isLoading && isAuthenticated ? (
						<div className="hidden items-center gap-2 md:flex">
							<Button
								variant="outline"
								size="sm"
								className="border-white/70 bg-white/10 text-white hover:bg-white hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
							>
								{user?.name ?? "User"}
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={handleLogout}
								className="border-white/70 bg-transparent text-white hover:bg-white hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
							>
								Logout
							</Button>
						</div>
					) : null}

					<button
						onClick={() => setOpen(!open)}
						className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900 md:hidden"
						aria-label="Toggle navigation"
					>
						{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
					</button>
				</div>
			</div>

			{open ? (
				<motion.nav
					initial={{ height: 0, opacity: 0 }}
					animate={{ height: "auto", opacity: 1 }}
					transition={{ duration: 0.2 }}
					className="border-t border-slate-200/70 bg-white/95 px-4 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 md:hidden"
				>
					<div className="flex flex-col gap-2">
						{navItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									"rounded-lg px-3 py-2 text-sm font-medium transition-colors",
									pathname === item.href
										? "bg-blue-50 text-blue-700 dark:bg-blue-600/20 dark:text-blue-200"
										: "text-slate-600 hover:text-blue-700 dark:text-slate-200 dark:hover:text-blue-200",
								)}
								onClick={() => setOpen(false)}
							>
								{item.label}
							</Link>
						))}
						{!isLoading && !isAuthenticated ? (
							<div className="flex gap-2 pt-2">
								<Link href="/login" className="flex-1">
									<Button
										variant="outline"
										size="sm"
										className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
									>
										Login
									</Button>
								</Link>
								<Link href="/signup" className="flex-1">
									<Button
										size="sm"
										className="w-full bg-emerald-700 text-white hover:bg-emerald-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
									>
										Sign up
									</Button>
								</Link>
							</div>
						) : null}
						{!isLoading && isAuthenticated ? (
							<div className="mt-2 space-y-2">
								<Button
									variant="outline"
									size="sm"
									className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
								>
									{user?.name ?? "User"}
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={handleLogout}
									className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
								>
									Logout
								</Button>
							</div>
						) : null}
					</div>
				</motion.nav>
			) : null}
		</header>
	);
}

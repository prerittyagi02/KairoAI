"use client";

import {
	FileText,
	Home,
	ImageIcon,
	MessageCircle,
	Mic,
	Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthUser } from "@/hooks/useAuthUser";
import { cn } from "@/lib/utils";

const navItems = [
	{ href: "/dashboard", label: "Dashboard", icon: Home },
	{ href: "/upload-report", label: "Upload Report", icon: FileText },
	{ href: "/upload-xray", label: "Upload X-ray", icon: ImageIcon },
	{ href: "/upload-audio", label: "Voice Symptom", icon: Mic },
	{ href: "/chat", label: "AI Chat", icon: MessageCircle },
	{ href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
	const pathname = usePathname();
	const { user } = useAuthUser();
	const initials = user?.name
		? user.name
				.split(" ")
				.filter(Boolean)
				.slice(0, 2)
				.map((part: string) => part[0]?.toUpperCase())
				.join("")
		: "U";

	return (
		<aside className="h-auto hidden w-64 flex-col border-r border-slate-200 bg-white/80 p-0 mt-4 pb-8 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70 lg:flex">
			<div className="mb-8 flex items-center gap-3">
				<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-white shadow">
					<span className="font-bold">{initials}</span>
				</div>
				<div>
					<p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
						{user?.name ?? "User"}
					</p>
					<p className="max-w-[180px] truncate text-xs text-slate-500 dark:text-slate-400">
						{user?.email ?? "Signed in"}
					</p>
				</div>
			</div>

			<nav className="flex flex-col gap-1">
				{navItems.map((item) => {
					const Icon = item.icon;
					const active = pathname === item.href;

					return (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								"group flex items-center gap-3 rounded-xl px-0 py-2 text-sm font-medium transition-colors",
								active
									? "bg-teal-50 text-teal-700 dark:bg-teal-600/20 dark:text-teal-200"
									: "text-slate-600 hover:bg-slate-100 hover:text-teal-700 dark:text-slate-200 dark:hover:bg-slate-900 dark:hover:text-teal-200",
							)}
						>
							<Icon className="h-5 w-5" />
							{item.label}
						</Link>
					);
				})}
			</nav>
		</aside>
	);
}

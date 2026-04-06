import type { Metadata } from "next";
import AppFooter from "@/components/AppFooter";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
	title: "Dashboard | Kairo AI",
	description: "Your personalized health dashboard.",
};

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-100">
			<Navbar elongate={true} />
			<div className="mx-auto grid w-full grid-cols-1 gap-0 pl-3 pr-0 py-0 lg:grid-cols-[256px_1fr]">
				<Sidebar />
				<main className="min-h-[calc(100vh-145px)] rounded-none bg-white/80 px-3 py-2 shadow-sm ring-1 ring-slate-200 backdrop-blur dark:bg-slate-950/70 dark:ring-slate-800">
					{children}
				</main>
			</div>

			<AppFooter />
		</div>
	);
}

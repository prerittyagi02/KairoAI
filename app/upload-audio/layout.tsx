import type { Metadata } from "next";
import AppFooter from "@/components/AppFooter";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Voice Symptom | Kairo AI",
  description: "Record or upload symptom audio and receive structured AI guidance.",
};

export default function UploadAudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-100">
      <Navbar elongate={true} />
      <div className="mx-auto grid w-full grid-cols-1 gap-0 px-4 py-0 lg:grid-cols-[256px_1fr]">
        <Sidebar />
        <main className="min-h-[calc(100vh-145px)] py-3">{children}</main>
      </div>
      <AppFooter />
    </div>
  );
}

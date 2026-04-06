"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

const highlights = [
  "Understand reports in plain language",
  "Talk in your preferred language",
  "Get clear next-step suggestions",
];

export default function HeroSection() {
  return (
    <section className="border-b border-emerald-100 bg-gradient-to-b from-emerald-50/70 via-white to-sky-50/60 py-16 dark:border-slate-800 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-2 lg:items-center">
        <div className="text-center lg:text-left">
          <p className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300">
            AI healthcare assistant
          </p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mt-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl"
          >
            Simple, clear health insights with Kairo AI
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg"
          >
            Upload reports, share symptoms by voice, and get easy-to-understand explanations in your preferred language.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start"
          >
            <Link href="/signup">
              <Button size="lg" className="rounded-full bg-emerald-700 px-8 text-white hover:bg-emerald-800 dark:bg-emerald-600 dark:text-white dark:hover:bg-emerald-500">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="rounded-full px-8">
                Login
              </Button>
            </Link>
          </motion.div>

          <ul className="mt-8 space-y-3 text-left">
            {highlights.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="flex justify-center lg:justify-end"
        >
          <Image
            src="/doctor.jpg"
            alt="Doctor using digital tools"
            width={900}
            height={680}
            priority
            className="h-auto w-full max-w-md rounded-2xl border border-emerald-100 object-cover shadow-sm dark:border-slate-700"
          />
        </motion.div>
      </div>
    </section>
  );
}

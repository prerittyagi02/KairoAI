"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ShieldCheck,
  Sparkles,
  HeartPulse,
  Globe,
  Mic,
  FileText,
  Languages,
  Clock3,
  BellRing,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Secure & Private",
    description: "All data stays confidential and protected with modern security best practices.",
    image:
      "https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?cs=srgb&dl=pexels-ekaterina-bolovtsova-5380642.jpg&fm=jpg",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Insights",
    description: "AI-driven summaries and explanations make medical data easy to understand.",
    image:
      "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?cs=srgb&dl=pexels-tara-winstead-8386440.jpg&fm=jpg",
  },
  {
    icon: HeartPulse,
    title: "Health Guidance",
    description: "Get actionable suggestions for next steps and follow-ups.",
    image:
      "https://images.pexels.com/photos/7659563/pexels-photo-7659563.jpeg?cs=srgb&dl=pexels-anna-shvets-7659563.jpg&fm=jpg",
  },
  {
    icon: Globe,
    title: "Multilingual Support",
    description: "Interact in Hindi, Tamil, Bengali, Telugu, and more.",
    image:
      "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?cs=srgb&dl=pexels-fauxels-3184465.jpg&fm=jpg",
  },
  {
    icon: Mic,
    title: "Voice Symptom Capture",
    description: "Describe symptoms naturally by voice without typing long messages.",
    image:
      "https://images.pexels.com/photos/8436736/pexels-photo-8436736.jpeg?cs=srgb&dl=pexels-karolina-grabowska-8436736.jpg&fm=jpg",
  },
  {
    icon: FileText,
    title: "Report Summaries",
    description: "Long lab reports are turned into short and clear key takeaways.",
    image:
      "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?cs=srgb&dl=pexels-karolina-grabowska-4386467.jpg&fm=jpg",
  },
  {
    icon: Languages,
    title: "Plain Language Mode",
    description: "Complex medical terms are translated into simple, friendly language.",
    image:
      "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?cs=srgb&dl=pexels-andrea-piacquadio-3769021.jpg&fm=jpg",
  },
  {
    icon: Clock3,
    title: "24/7 Assistance",
    description: "Get guidance anytime so questions do not have to wait until appointments.",
    image:
      "https://images.pexels.com/photos/4225920/pexels-photo-4225920.jpeg?cs=srgb&dl=pexels-cottonbro-4225920.jpg&fm=jpg",
  },
  {
    icon: BellRing,
    title: "Follow-up Reminders",
    description: "Smart nudges help you remember next tests, medicines, and consultations.",
    image:
      "https://images.pexels.com/photos/6990564/pexels-photo-6990564.jpeg?cs=srgb&dl=pexels-thirdman-6990564.jpg&fm=jpg",
  },
];

export default function FeaturesSection() {
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);

    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    features.forEach((feature) => {
      const img = new window.Image();
      img.src = feature.image;
    });
  }, []);

  const visibleCount = isMobile ? 1 : 3;
  const pageCount = Math.ceil(features.length / visibleCount);

  useEffect(() => {
    if (!isMobile && index % 3 !== 0) {
      setIndex(index - (index % 3));
    }
  }, [index, isMobile]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + visibleCount) % features.length);
    }, 3200);

    return () => clearInterval(interval);
  }, [visibleCount]);

  const visibleFeatures = useMemo(() => {
    return Array.from({ length: visibleCount }, (_, offset) => {
      return features[(index + offset) % features.length];
    });
  }, [index, visibleCount]);

  return (
    <section className="relative overflow-hidden bg-white/70 py-16 dark:bg-gradient-to-b dark:from-slate-950 dark:to-slate-900 sm:py-12">
      <div className="pointer-events-none absolute -left-24 top-16 h-52 w-52 rounded-full bg-emerald-200/40 blur-3xl dark:hidden" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-52 w-52 rounded-full bg-sky-200/40 blur-3xl dark:hidden" />

      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">Platform features</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
            Built to simplify healthcare communication, Kairo AI helps patients understand reports, track symptoms, and make informed decisions with confidence.
          </p>
        </div>

        <div className="relative mx-auto mt-12 max-w-6xl">
          <div className="grid gap-6 md:grid-cols-3">
            <AnimatePresence initial={false} mode="popLayout">
              {visibleFeatures.map((feature, cardIndex) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    layout
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 18 }}
                    transition={{ duration: 0.45, ease: "easeOut", delay: cardIndex * 0.04 }}
                    className="rounded-2xl border border-emerald-200 bg-emerald-50/45 p-6 shadow-sm transition-colors hover:bg-emerald-100/60 dark:border-slate-700 dark:bg-slate-900/90 dark:hover:bg-slate-800"
                  >
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      width={640}
                      height={256}
                      className="mb-4 h-32 w-full rounded-xl object-cover"
                    />
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-slate-800 dark:text-emerald-300">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">{feature.title}</h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{feature.description}</p>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: pageCount }, (_, pageIndex) => {
            const isActive = Math.floor(index / visibleCount) === pageIndex;
            return (
              <span
                key={`page-dot-${pageIndex}`}
                className={`h-2.5 rounded-full transition-all ${
                  isActive ? "w-7 bg-emerald-600 dark:bg-emerald-400" : "w-2.5 bg-emerald-200 dark:bg-slate-700"
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

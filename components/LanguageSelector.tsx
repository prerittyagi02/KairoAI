"use client";

import { useEffect } from "react";

export type LanguageCode =
  | "en"
  | "hi"
  | "ta"
  | "te"
  | "bn"
  | "mr"
  | "gu"
  | "pa"
  | "ml"
  | "kn";

const languageOptions: { label: string; value: LanguageCode }[] = [
  { label: "English", value: "en" },
  { label: "Hindi", value: "hi" },
  { label: "Tamil", value: "ta" },
  { label: "Telugu", value: "te" },
  { label: "Bengali", value: "bn" },
  { label: "Marathi", value: "mr" },
  { label: "Gujarati", value: "gu" },
  { label: "Punjabi", value: "pa" },
  { label: "Malayalam", value: "ml" },
  { label: "Kannada", value: "kn" },
];

type Props = {
  value: LanguageCode;
  onChange: (newLang: LanguageCode) => void;
  className?: string;
};

export default function LanguageSelector({ value, onChange, className }: Props) {
  useEffect(() => {
    if (!value) {
      onChange("en");
    }
  }, [value, onChange]);

  return (
    <div className={className}>
      <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Language
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as LanguageCode)}
        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      >
        {languageOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

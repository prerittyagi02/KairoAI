"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSetAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use_toast";
import { signup } from "@/services/authService";
import { hydrateAuthUserAtom } from "@/store/authAtom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hydrateAuthUser = useSetAtom(hydrateAuthUserAtom);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError("");
    const safeName = name.trim();
    const safeEmail = email.trim().toLowerCase();
    const safePassword = password.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (safeName.length < 2) {
      toast({
        variant: "destructive",
        title: "Invalid name",
        description: "Name must be at least 2 characters long.",
      });
      setFormError("Name must be at least 2 characters long.");
      return;
    }

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

    if (safePassword.length < 8) {
      toast({
        variant: "destructive",
        title: "Weak password",
        description: "Password must be at least 8 characters long.",
      });
      setFormError("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);

    const result = await signup({
      name: safeName,
      email: safeEmail,
      password: safePassword,
      preferredLanguage,
    });
    if (result.success && result.data?.token) {
      localStorage.setItem("kairo_token", result.data.token);
      await hydrateAuthUser(true);
      toast({ title: "Welcome!", description: "Your account is ready." });
      const next = searchParams?.get("next") || "/dashboard";
      router.push(next);
      router.refresh();
    } else {
      const message = result.error || "Unable to create an account.";
      toast({
        variant: "destructive",
        title: "Signup failed",
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

      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-8 px-6 py-12 lg:grid-cols-2">
        <div className="hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-100/80 to-white p-10 lg:block dark:border-slate-700 dark:from-slate-900 dark:to-slate-900">
          <p className="inline-flex rounded-full border border-emerald-300 bg-white/80 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-800 dark:border-slate-600 dark:bg-slate-800 dark:text-emerald-300">
            WELCOME TO KAIRO AI
          </p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight text-slate-900 dark:text-white">
            Create your account and start understanding your health with clarity
          </h1>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
            Get personalized, multilingual support for reports, symptoms, and follow-up guidance in one place.
          </p>

          <div className="mt-8 space-y-4">
            {[
              "Plain-language explanations for reports",
              "Voice-based symptom capture and smart summaries",
              "Privacy-first experience for personal health data",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto w-full max-w-md rounded-3xl border border-emerald-300 bg-white p-8 shadow-[0_22px_70px_-28px_rgba(5,150,105,0.45)] backdrop-blur dark:border-slate-600 dark:bg-slate-900 sm:p-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create your account</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Join Kairo AI to simplify your health conversations.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  className="mt-1 border-emerald-200 bg-emerald-50/40 focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
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
              <div>
                <Label htmlFor="language">Preferred language</Label>
                <select
                  id="language"
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-700"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="ta">Tamil</option>
                  <option value="te">Telugu</option>
                  <option value="bn">Bengali</option>
                  <option value="mr">Marathi</option>
                  <option value="gu">Gujarati</option>
                  <option value="pa">Punjabi</option>
                  <option value="ml">Malayalam</option>
                  <option value="kn">Kannada</option>
                </select>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-700 text-white hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
            {formError ? (
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                {formError}
              </p>
            ) : null}
          </form>

          <div className="mt-6 border-t border-emerald-100 pt-6 text-center text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-emerald-700 hover:text-emerald-800 dark:text-emerald-300">
              Log in
            </Link>
          </div>

          <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
            By signing up, you agree to receive health guidance insights from Kairo AI.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white dark:bg-slate-950" />}>
      <SignupContent />
    </Suspense>
  );
}

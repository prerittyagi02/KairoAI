"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell, Globe2, MoonStar, ShieldCheck, UserCircle2 } from "lucide-react";
import { useAuthUser } from "@/hooks/useAuthUser";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use_toast";
import { updateSettings } from "@/services/authService";

type KairoSettings = {
  displayName: string;
  preferredLanguage: string;
  defaultScanType: "xray" | "ecg";
  notificationAlerts: boolean;
  useDarkMode: boolean;
};

const SETTINGS_KEY = "kairo_settings";

const defaultSettings: KairoSettings = {
  displayName: "",
  preferredLanguage: "en",
  defaultScanType: "xray",
  notificationAlerts: true,
  useDarkMode: false,
};

export default function SettingsPage() {
  const { user, setUser } = useAuthUser();
  const [settings, setSettings] = useState<KairoSettings>(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(SETTINGS_KEY);
    let parsed: Partial<KairoSettings> = {};
    if (raw) {
      try {
        parsed = JSON.parse(raw) as Partial<KairoSettings>;
      } catch {
        localStorage.removeItem(SETTINGS_KEY);
      }
    }

    setSettings({
      ...defaultSettings,
      ...parsed,
      displayName: parsed.displayName || user?.name || "",
      useDarkMode: document.documentElement.classList.contains("dark"),
    });
  }, [user?.name]);

  const profileEmail = useMemo(() => user?.email ?? "Not available", [user?.email]);

  const onChange = <K extends keyof KairoSettings>(key: K, value: KairoSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const onSave = async () => {
    setIsSaving(true);
    try {
      const displayName = settings.displayName.trim();
      if (!displayName) {
        toast({
          title: "Display name required",
          description: "Please enter your display name before saving.",
          variant: "destructive",
        });
        return;
      }

      const response = await updateSettings({
        displayName,
        preferredLanguage: settings.preferredLanguage,
      });

      if (!response.success || !response.data?.user) {
        toast({
          title: "Unable to save settings",
          description: response.error ?? "Something went wrong while saving.",
          variant: "destructive",
        });
        return;
      }

      setUser(response.data.user);
      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({ ...settings, displayName: response.data.user.name })
      );
      localStorage.setItem("darkMode", String(settings.useDarkMode));
      document.documentElement.classList.toggle("dark", settings.useDarkMode);

      toast({
        title: "Settings saved",
        description: "Your profile and preferences were updated.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-100/80 to-sky-100/80 p-6 dark:border-slate-700 dark:from-slate-900 dark:to-slate-800">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
          Preferences
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Settings
        </h1>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
          Manage profile details, language, alerts, and app behavior in one place.
        </p>
      </div>

      <div className="grid gap-3 xl:grid-cols-[1.2fr_1fr]">
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircle2 className="h-5 w-5 text-emerald-600" />
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display name</Label>
              <Input
                id="displayName"
                value={settings.displayName}
                onChange={(e) => onChange("displayName", e.target.value)}
                placeholder="Your display name"
                className="border-emerald-200 bg-emerald-50/40 dark:border-slate-700 dark:bg-slate-900"
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={profileEmail} disabled className="dark:bg-slate-900" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredLanguage">Preferred language</Label>
              <select
                id="preferredLanguage"
                value={settings.preferredLanguage}
                onChange={(e) => onChange("preferredLanguage", e.target.value)}
                className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-700"
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
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe2 className="h-5 w-5 text-indigo-600" />
                App Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="defaultScanType">Default scan type</Label>
                <select
                  id="defaultScanType"
                  value={settings.defaultScanType}
                  onChange={(e) =>
                    onChange("defaultScanType", e.target.value as "xray" | "ecg")
                  }
                  className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-700"
                >
                  <option value="xray">X-ray</option>
                  <option value="ecg">ECG</option>
                </select>
              </div>

              <label className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm text-slate-800 dark:text-slate-200">Notification alerts</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notificationAlerts}
                  onChange={(e) => onChange("notificationAlerts", e.target.checked)}
                  className="h-4 w-4 accent-emerald-600"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
                <div className="flex items-center gap-2">
                  <MoonStar className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm text-slate-800 dark:text-slate-200">Use dark mode</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.useDarkMode}
                  onChange={(e) => onChange("useDarkMode", e.target.checked)}
                  className="h-4 w-4 accent-emerald-600"
                />
              </label>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <p>
                Your local preferences are stored in your browser to personalize your experience.
              </p>
              <p>Health analysis should always be reviewed by a qualified clinician.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={onSave}
          disabled={isSaving}
          className="bg-emerald-700 text-white hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
        >
          {isSaving ? "Saving..." : "Save settings"}
        </Button>
      </div>
    </div>
  );
}

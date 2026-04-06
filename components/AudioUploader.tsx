"use client";

import { useMemo, useState } from "react";
import { Upload, Music, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  label?: string;
  accept?: string;
  onAudioSelected?: (file: File) => void;
  isLoading?: boolean;
};

export default function AudioUploader({
  label = "Upload voice recording",
  accept = "audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/webm",
  onAudioSelected,
  isLoading,
}: Props) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const fileInfo = useMemo(() => {
    if (!fileName) return null;
    return fileName.length > 32 ? `${fileName.slice(0, 28)}...` : fileName;
  }, [fileName]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    onAudioSelected?.(file);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-500/20 dark:text-teal-200">
            <Music className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{label}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Upload audio from your device.</p>
          </div>
        </div>
        <label className="relative cursor-pointer">
          <input
            type="file"
            accept={accept}
            className="sr-only"
            onChange={handleChange}
            disabled={isLoading}
          />
          <span className={cn(
            "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition",
            isLoading
              ? "bg-slate-200 text-slate-500"
              : "bg-teal-600 text-white hover:bg-teal-700"
          )}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Choose Audio
              </>
            )}
          </span>
        </label>
      </div>

      {audioUrl ? (
        <div className="mt-4 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
          <audio src={audioUrl} controls className="w-full" />
          <div className="text-sm text-slate-600 dark:text-slate-200">
            <span className="font-medium">File:</span> {fileInfo}
          </div>
        </div>
      ) : null}
    </div>
  );
}

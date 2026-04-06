"use client";

import { useMemo, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  label?: string;
  accept?: string;
  onImageSelected?: (file: File) => void;
  isLoading?: boolean;
};

export default function ImageUploader({
  label = "Upload X-ray / ECG image",
  accept = "image/png,image/jpeg,image/webp",
  onImageSelected,
  isLoading,
}: Props) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInfo = useMemo(() => {
    if (!fileName) return null;
    return fileName.length > 32 ? `${fileName.slice(0, 28)}...` : fileName;
  }, [fileName]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onImageSelected?.(file);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-500/20 dark:text-teal-200">
            <ImagePlus className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{label}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Supports PNG, JPG, WEBP.</p>
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
                Processing...
              </>
            ) : (
              "Choose Image"
            )}
          </span>
        </label>
      </div>

      {previewUrl ? (
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
          <img src={previewUrl} alt="preview" className="h-60 w-full object-contain" />
          <div className="px-4 py-3 text-sm text-slate-600 dark:text-slate-200">
            <span className="font-medium">Selected:</span> {fileInfo}
          </div>
        </div>
      ) : null}
    </div>
  );
}

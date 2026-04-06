import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ChangeEvent, FC, useState } from "react";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";
import SocialMediaLinks from "./social-links";
import { FileText, Mic, Loader2, Upload, CheckCircle } from "lucide-react";

type Props = {
  onReportConfirmation: (data: string) => void;
};

const ReportComponent: FC<Props> = ({ onReportConfirmation }: Props) => {
  const { toast } = useToast();
  const [base64Data, setBase64Data] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState("");
  const [activeTab, setActiveTab] = useState<"text" | "speech">("text");
  const [hasFile, setHasFile] = useState(false);
  const [fileName, setFileName] = useState("");

  async function extractDetails() {
    if (!base64Data) {
      toast({
        variant: "destructive",
        description: `Upload a valid ${
          activeTab === "text" ? "report" : "speech file"
        }!`,
      });
      return;
    }

    setIsLoading(true);
    try {
const response = await fetch("/api/upload/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileBase64: base64Data,
        language: "en",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const reportText = data?.analysis || data?.report || data?.summary || "";

        const formattedText = String(reportText)
          .replace(/\\n/g, "\n")
          .replace(/\*\*/g, "")
          .replace(/^##\s*/gm, "")
          .trim();

        setReportData(formattedText);
        onReportConfirmation(formattedText);

        toast({
          variant: "default",
          description: "Document successfully processed!",
          className:
            "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
        });
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast({
        variant: "destructive",
        description: "Failed to process the document. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleReportSelection(event: ChangeEvent<HTMLInputElement>): void {
    if (!event.target.files) return;

    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setHasFile(true);

      let isValidImage = false;
      let isValidDoc = false;
      const validImages = ["image/jpeg", "image/png", "image/webp"];
      const validDocs = ["application/pdf"];
      if (validImages.includes(file.type)) {
        isValidImage = true;
      }
      if (validDocs.includes(file.type)) {
        isValidDoc = true;
      }
      if (!(isValidImage || isValidDoc)) {
        toast({
          variant: "destructive",
          description: "Filetype not supported!",
        });
        setHasFile(false);
        return;
      }

      if (isValidImage) {
        compressImage(file, (compressedFile) => {
          const reader = new FileReader();

          reader.onloadend = () => {
            const base64String = reader.result as string;
            setBase64Data(base64String);
          };

          reader.readAsDataURL(compressedFile);
        });
      }

      if (isValidDoc) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setBase64Data(base64String);
        };

        reader.readAsDataURL(file);
      }
    }
  }

  function handleSpeechSelection(event: ChangeEvent<HTMLInputElement>): void {
    if (!event.target.files) return;

    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setHasFile(true);

      const validAudioTypes = [
        "audio/mp3",
        "audio/mpeg",
        "audio/wav",
        "audio/ogg",
        "audio/webm",
      ];

      if (!validAudioTypes.includes(file.type)) {
        toast({
          variant: "destructive",
          description:
            "Audio filetype not supported! Please use MP3, WAV, or OGG format.",
        });
        setHasFile(false);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setBase64Data(base64String);
      };

      reader.readAsDataURL(file);
    }
  }

  function compressImage(file: File, callback: (compressedFile: File) => void) {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;

        ctx!.drawImage(img, 0, 0);
        const quality = 0.1;
        const dataURL = canvas.toDataURL("image/jpeg", quality);

        const byteString = atob(dataURL.split(",")[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const compressedFile = new File([ab], file.name, {
          type: "image/jpeg",
        });

        callback(compressedFile);
      };
      img.src = e.target!.result as string;
    };

    reader.readAsDataURL(file);
  }

  return (
    <div className="grid w-full items-start gap-6 p-1 pt-0">
      <fieldset className="relative grid gap-5 rounded-lg border border-indigo-100 dark:border-gray-700 p-6 bg-white dark:bg-gray-800 shadow-sm">
        {isLoading && (
          <div className="absolute inset-0 z-10 bg-white/95 dark:bg-gray-800/95 rounded-lg flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 text-indigo-500 dark:text-indigo-400 animate-spin mb-2" />
            <p className="text-indigo-700 dark:text-indigo-300 font-medium">
              Analyzing your document...
            </p>
          </div>
        )}

        {/* Enhanced Tab UI */}
        <div className="grid grid-cols-2 gap-2 w-full border rounded-lg overflow-hidden shadow-sm">
          <button
            onClick={() => setActiveTab("text")}
            className={`py-3 text-center transition-all flex items-center justify-center gap-2 ${
              activeTab === "text"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Text/Document</span>
          </button>
          <button
            onClick={() => setActiveTab("speech")}
            className={`py-3 text-center transition-all flex items-center justify-center gap-2 ${
              activeTab === "speech"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
            }`}
          >
            <Mic className="h-4 w-4" />
            <span>Speech/Audio</span>
          </button>
        </div>

        {/* File Upload Area */}
        <div className="py-4">
          <div className="border-2 border-dashed border-indigo-200 dark:border-gray-600 rounded-lg p-6 text-center">
            <div className="mb-4">
              <div className="mx-auto h-12 w-12 text-indigo-400 dark:text-indigo-300 mb-2">
                {activeTab === "text" ? (
                  <FileText size={48} />
                ) : (
                  <Mic size={48} />
                )}
              </div>
              <p className="text-sm text-indigo-800 dark:text-indigo-200 font-medium">
                {hasFile ? (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    {fileName}
                  </span>
                ) : (
                  <span>
                    Upload your{" "}
                    {activeTab === "text"
                      ? "medical document"
                      : "speech recording"}
                  </span>
                )}
              </p>
            </div>

            <label className="inline-flex cursor-pointer">
              <Input
                type="file"
                className="hidden"
                accept={
                  activeTab === "text"
                    ? "image/jpeg,image/png,image/webp,application/pdf"
                    : "audio/mp3,audio/mpeg,audio/wav,audio/ogg,audio/webm"
                }
                onChange={
                  activeTab === "text"
                    ? handleReportSelection
                    : handleSpeechSelection
                }
              />
              <div className="rounded-full bg-indigo-100 dark:bg-indigo-900/30 px-4 py-2 text-sm font-medium text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800/50 transition-colors flex items-center gap-2">
                <Upload className="size-4" />
                Browse Files
              </div>
            </label>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              Supported formats:{" "}
              {activeTab === "text"
                ? "JPEG, PNG, WEBP, PDF"
                : "MP3, WAV, OGG, WEBM"}
            </p>
          </div>
        </div>

        {/* Extract Button */}
        <Button
          onClick={extractDetails}
          className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-medium py-2 flex items-center justify-center gap-2"
          disabled={!hasFile || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>
                1. Analyze {activeTab === "text" ? "Document" : "Speech"}
              </span>
            </>
          )}
        </Button>

        {/* Report Data Textarea */}
        <div className="relative">
          <Textarea
            value={reportData}
            onChange={(e) => {
              setReportData(e.target.value);
            }}
            placeholder={
              activeTab === "text"
                ? "Extracted data from your report will appear here. Get better recommendations by providing additional details..."
                : "Transcribed and analyzed speech data will appear here. You can edit or add additional context..."
            }
            className="min-h-64 resize-none border rounded-lg p-4 shadow-inner bg-gray-50 dark:bg-gray-900/50 focus-visible:ring-1 focus-visible:ring-indigo-300 dark:focus-visible:ring-indigo-700"
          />
        </div>

        {/* Finalize Button */}
        <Button
          className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white font-medium py-2"
          onClick={() => {
            onReportConfirmation(reportData);
          }}
          disabled={!reportData.trim()}
        >
          2. Finalize {activeTab === "text" ? "Report" : "Speech Analysis"}
        </Button>

        {/* Social Media Links */}
        <div className="flex flex-row items-center justify-center gap-3 pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
          <Label className="text-gray-600 dark:text-gray-400">
            Share your experience
          </Label>
          <SocialMediaLinks />
        </div>
      </fieldset>
    </div>
  );
};

export default ReportComponent;
